import { parseCookie, serializeCookie } from "lucia/utils";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

import type {
  IOAuthProviderFactoryService,
  ISessionService,
  IUserService,
  ServerContext,
} from "~/server/interfaces";
import type { PrismaClient, User } from "~/server/db/interfaces.server";
import type { Dependency } from "~/server/injection";
import {
  ACCESS_TOKEN_DURATION,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_DURATION,
  REFRESH_TOKEN_SECRET,
} from "~/server/constants.server";
import { PAGES } from "~/constants";

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

export class SessionService
  implements ISessionService, Dependency<ServerContext>
{
  _oauthProviderFactoryService!: IOAuthProviderFactoryService;
  _userService!: IUserService;

  constructor(private _db: PrismaClient) {}

  init(context: ServerContext): void {
    this._oauthProviderFactoryService = context.oauthProviderFactoryService;
    this._userService = context.userService;
  }

  async handleCredentialSignIn(request: Request): Promise<Response> {
    const { email, password } =
      await this._getEmailPasswordFromRequest(request);

    const credential = await this._db.credential.findFirst({
      include: {
        user: true,
      },
      where: {
        user: {
          email,
        },
      },
    });
    if (!credential) throw new Error("Credential not found for user.");

    const match = bcrypt.compare(password, credential.passwordHash!);
    if (!match) throw new Error("Incorrect email or password.");

    return this._authenticateUser(credential.user);
  }

  async handleCredentialSignUp(request: Request): Promise<Response> {
    const { email, password } =
      await this._getEmailPasswordFromRequest(request);

    const existingUser = await this._userService.getByEmail(email);
    if (existingUser) {
      throw new Error("Invalid username/password.");
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
      throw new Error("Email/password required."); // FIXME: MANAGE THIS BETTER
    }
    return result.data;
  }

  async redirectToOAuthProvider(providerName: string): Promise<Response> {
    const provider =
      this._oauthProviderFactoryService.getProvider(providerName);
    const { url, state } = await provider.getOAuthRedirect();
    const stateCookie = serializeCookie(
      this._getStateCookieName(providerName),
      state,
      {
        httpOnly: true,
        secure: false, // `true` for production
        path: "/",
        maxAge: 60 * 60,
      },
    );
    return new Response(null, {
      status: 302,
      headers: {
        Location: url,
        "Set-Cookie": stateCookie,
      },
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
        emailVerified,
      },
    );
    return this._authenticateUser(user);
  }

  _getAuthCookieName(): string {
    return "webapp_auth";
  }

  _getStateCookieName(providerName: string): string {
    return `${providerName}_oauth_state`;
  }

  async _authenticateUser(user: User): Promise<Response> {
    const userProps = {
      uid: user.id,
    };

    const accessToken = jwt.sign(userProps, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_DURATION,
    });

    const refreshToken = jwt.sign(userProps, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_DURATION,
    });

    await this._db.$transaction(async (tx) => {
      tx.token.updateMany({
        data: {
          revoked: new Date(),
        },
        where: {
          userId: user.id,
        },
      });

      tx.token.createMany({
        data: [
          {
            type: "access",
            userId: user.id,
            token: accessToken,
          },
          {
            type: "refresh",
            userId: user.id,
            token: accessToken,
          },
        ],
      });
    });

    const authCookie = serializeCookie(
      this._getAuthCookieName(),
      JSON.stringify({
        accessToken: accessToken,
        refreshToken: refreshToken,
      }),
      {
        httpOnly: true,
        secure: false, // `true` for production
        path: "/",
        maxAge: 60 * 60,
      },
    );

    return new Response(null, {
      status: 302,
      headers: {
        Location: PAGES.HOME,
        "Set-Cookie": authCookie,
      },
    });
  }

  handleSignOut(): Response {
    const authCookie = serializeCookie(this._getAuthCookieName(), "", {
      httpOnly: true,
      secure: false, // `true` for production
      path: "/",
      maxAge: 60 * 60,
      expires: new Date(),
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: PAGES.SIGN_IN,
        "Set-Cookie": authCookie,
      },
    });
  }

  getAuthenticatedUserId(request: Request): string | null {
    const cookies = parseCookie(request.headers.get("Cookie") ?? "");
    let data;
    try {
      data = JSON.parse(cookies[this._getAuthCookieName()]);
    } catch (error) {
      return null;
    }

    const parseResult = authCookieSchema.safeParse(data);
    if (!parseResult.success) return null;
    const { accessToken } = parseResult.data;

    try {
      jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    } catch (error) {
      return null;
    }

    // FIXME: SHOULD ALSO VALIDATE IF TOKEN IS REVOKED.
    const jwtResult = jwtContentsSchema.safeParse(jwt.decode(accessToken));
    if (!jwtResult.success) return null;

    return jwtResult.data.uid;
  }
}
