import { parseCookie, serializeCookie } from "lucia/utils";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { z } from "zod";

import type { IOAuthProviderFactoryService } from "~/types/IOAuthProviderFactoryService";
import type { ISessionService } from "~/types/ISessionService";
import type { IUserService } from "~/types/IUserService";
import type { IMailService } from "~/types/IMailService";
import type { IClockService } from "~/types/IClockService";
import type { ILoggerService } from "~/types/ILoggerService";
import type { IDatabaseService } from "~/types/IDatabaseService";
import type { ServerContext } from "~/types/ServerContext";

import type { User } from "@app/db";

import { add } from "date-fns";
import { VerificationEmailTemplate } from "../mail/templates";
import { BadRequestError } from "~/server/errors/BadRequestError";

const credentialSchema = z.object({
  email: z.string(),
  password: z.string(),
});

const authCookieSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

const jwtContentsSchema = z.object({
  uid: z.string(),
});

export type CookieSerializeOptions = NonNullable<
  Parameters<typeof serializeCookie>[2]
>;

export type TokenConfiguration = {
  secret: string;
  duration: string;
};

export class SessionService implements ISessionService {
  constructor(
    private _cookieName: string,
    private _cookieSerializeOptions: CookieSerializeOptions,
    private _accessTokenConfiguration: TokenConfiguration,
    private _refreshTokenConfiguration: TokenConfiguration,
    private _signInRedirectUri: URL,
    private _signOutRedirectUri: URL,
    private _databaseService: IDatabaseService,
    private _clockService: IClockService,
    private _loggerService: ILoggerService,
    private _mailService: IMailService,
    private _oauthProviderFactoryService: IOAuthProviderFactoryService,
    private _userService: IUserService,
  ) {}

  async handleCredentialSignIn(request: Request): Promise<Response> {
    const { email, password } =
      await this._getEmailPasswordFromRequest(request);

    const credential = await this._databaseService
      .transaction()
      .credential.findFirst({
        include: {
          user: true,
        },
        where: {
          user: {
            email,
          },
        },
      });
    if (!credential)
      throw new BadRequestError("Credential not found for user.");

    const match = await bcrypt.compare(password, credential.passwordHash!);
    if (!match) throw new BadRequestError("Incorrect email or password.");

    return this._authenticateUser(credential.user);
  }

  async handleCredentialSignUp(request: Request): Promise<Response> {
    const { email, password } =
      await this._getEmailPasswordFromRequest(request);

    const existingUser = await this._userService.getByEmail(email);
    if (existingUser) {
      throw new BadRequestError("Invalid username/password.");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this._userService.createUserWithPassword(
      email,
      passwordHash,
    );

    return this._authenticateUser(user);
  }

  private async _getEmailPasswordFromRequest(
    request: Request,
  ): Promise<{ email: string; password: string }> {
    const formData = await request.formData();
    const rawData = Object.fromEntries(formData.entries());
    const result = credentialSchema.safeParse(rawData);
    if (!result.success) {
      throw new BadRequestError("Email/password required.");
    }
    return result.data;
  }

  private _redirect(url: string, headers: Record<string, string>): Response {
    return new Response(null, {
      status: 302,
      headers: new Headers({ ...headers, Location: url }),
    });
  }

  async redirectToOAuthProvider(providerName: string): Promise<Response> {
    const provider =
      this._oauthProviderFactoryService.getProvider(providerName);
    const { url, state } = await provider.getOAuthRedirect();
    const stateCookie = serializeCookie(
      this._getStateCookieName(providerName),
      state,
      this._cookieSerializeOptions,
    );
    return this._redirect(url, {
      "Set-Cookie": stateCookie,
    });
  }

  async handleOAuthResult(
    request: Request,
    providerName: string,
  ): Promise<Response> {
    const provider =
      this._oauthProviderFactoryService.getProvider(providerName);

    const cookies = parseCookie(request.headers.get("Cookie") ?? "");
    const storedState = cookies[this._getStateCookieName(providerName)];
    const url = new URL(request.url);
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");

    // validate state
    if (!storedState || !state || storedState !== state || !code) {
      throw new Error("Invalid State");
    }

    const {
      user: { id: providerId, email, emailVerified, fullName, avatar },
    } = await provider.getOAuthResult(code);
    const existingUser = await this._userService.getByOAuthProvider(
      providerName,
      providerId,
    );
    if (existingUser) return this._authenticateUser(existingUser);

    const user = await this._userService.createUserWithOAuthProvider(
      email,
      providerName,
      providerId,
      {
        fullName: fullName ?? null,
        avatar: avatar ?? null,
        emailVerifiedAt: emailVerified
          ? this._clockService.getCurrentDateTime()
          : null,
      },
    );
    return this._authenticateUser(user);
  }

  _getStateCookieName(providerName: string): string {
    return `${providerName}_oauth_state`;
  }

  async _authenticateUser(user: User): Promise<Response> {
    const userProps = {
      uid: user.id,
    };

    const accessToken = jwt.sign(
      userProps,
      this._accessTokenConfiguration.secret,
      {
        expiresIn: this._accessTokenConfiguration.duration,
      },
    );

    const refreshToken = jwt.sign(
      userProps,
      this._refreshTokenConfiguration.secret,
      {
        expiresIn: this._refreshTokenConfiguration.duration,
      },
    );

    await Promise.all([
      this._databaseService.transaction().token.updateMany({
        data: {
          revoked: this._clockService.getCurrentDateTime(),
        },
        where: {
          userId: user.id,
        },
      }),
      this._databaseService.transaction().token.createMany({
        data: [
          {
            type: "access",
            userId: user.id,
            token: accessToken,
          },
          {
            type: "refresh",
            userId: user.id,
            token: refreshToken,
          },
        ],
      }),
    ]);

    const authCookie = serializeCookie(
      this._cookieName,
      JSON.stringify({
        accessToken: accessToken,
        refreshToken: refreshToken,
      }),
      this._cookieSerializeOptions,
    );

    return this._redirect(this._signInRedirectUri.toString(), {
      "Set-Cookie": authCookie,
    });
  }

  handleSignOut(): Response {
    const authCookie = serializeCookie(
      this._cookieName,
      "",
      this._cookieSerializeOptions,
    );

    return this._redirect(this._signOutRedirectUri.toString(), {
      "Set-Cookie": authCookie,
    });
  }

  getAuthenticatedUserId(request: Request): string | null {
    const cookies = parseCookie(request.headers.get("Cookie") ?? "");
    let data;
    try {
      data = JSON.parse(cookies[this._cookieName]);
    } catch (error) {
      return null;
    }

    const parseResult = authCookieSchema.safeParse(data);
    if (!parseResult.success) return null;
    const { accessToken } = parseResult.data;

    try {
      jwt.verify(accessToken, this._accessTokenConfiguration.secret);
    } catch (error) {
      return null;
    }

    // FIXME: SHOULD ALSO VALIDATE IF TOKEN IS REVOKED.
    const jwtResult = jwtContentsSchema.safeParse(jwt.decode(accessToken));
    if (!jwtResult.success) return null;

    return jwtResult.data.uid;
  }

  async sendVerificationEmail(user: User): Promise<void> {
    const verificationCode = await this._databaseService
      .transaction()
      .verificationCode.upsert({
        create: {
          ...this._getNewVerificationCode(),
          userId: user.id,
        },
        update: {},
        where: {
          userId: user.id,
        },
      });

    if (verificationCode.expiresAt <= this._clockService.getCurrentDateTime()) {
      const newVerificationCode = this._getNewVerificationCode();
      Object.assign(verificationCode, newVerificationCode);
      await this._databaseService.transaction().verificationCode.update({
        data: newVerificationCode,
        where: {
          userId: user.id,
        },
      });
    }

    const template = new VerificationEmailTemplate(verificationCode.code);
    return this._mailService.sendEmail(
      template.getProps({
        destination: [user.email],
      }),
    );
  }

  _getNewVerificationCode(): { code: string; expiresAt: Date } {
    return {
      code: Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0"),
      expiresAt: add(this._clockService.getCurrentDateTime(), { hours: 1 }),
    };
  }

  async verifyEmail(user: User, code: string): Promise<boolean> {
    if (user.emailVerifiedAt) return true;

    const verificationCode = await this._databaseService
      .transaction()
      .verificationCode.findUnique({
        where: {
          userId: user.id,
        },
      });

    if (
      !verificationCode ||
      verificationCode.expiresAt <= this._clockService.getCurrentDateTime() ||
      verificationCode.code != code
    )
      return false;

    await Promise.all([
      this._databaseService.transaction().verificationCode.delete({
        where: {
          userId: user.id,
        },
      }),
      this._databaseService.transaction().user.update({
        data: {
          emailVerifiedAt: this._clockService.getCurrentDateTime(),
        },
        where: {
          id: user.id,
        },
      }),
    ]);

    return true;
  }

  async getAuthenticatedUser(request: Request): Promise<User | null> {
    const userId = this.getAuthenticatedUserId(request);
    if (!userId) return null;

    const user = await this._userService.getById(userId);
    if (!user) {
      this._loggerService.error("Could not find user.", { userId });
    }

    return user;
  }
}

export type SessionServiceOptions = {
  cookieName: string;
  cookieSerializeOptions: CookieSerializeOptions;
  accessTokenConfiguration: TokenConfiguration;
  refreshTokenConfiguration: TokenConfiguration;
  signInRedirectUri: URL;
  signOutRedirectUri: URL;
};

export const getSessionService =
  ({
    cookieName,
    cookieSerializeOptions,
    accessTokenConfiguration,
    refreshTokenConfiguration,
    signInRedirectUri,
    signOutRedirectUri,
  }: SessionServiceOptions) =>
  (context: ServerContext) => {
    return new SessionService(
      cookieName,
      cookieSerializeOptions,
      accessTokenConfiguration,
      refreshTokenConfiguration,
      signInRedirectUri,
      signOutRedirectUri,
      context.databaseService,
      context.clockService,
      context.loggerService,
      context.mailService,
      context.oauthProviderFactoryService,
      context.userService,
    );
  };
