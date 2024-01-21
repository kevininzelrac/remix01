import { parseCookie, serializeCookie } from "lucia/utils";
import bcrypt from "bcryptjs";
import { z } from "zod";

import type {
  IOAuthProviderFactoryService,
  ISessionService,
  IUserService,
  ServerContext,
} from "~/server/interfaces";
import type { PrismaClient, User } from "~/server/db/interfaces.server";
import type { Dependency } from "~/server/injection";

const credentialSchema = z.object({
  email: z.string(),
  password: z.string(),
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

    const passwordHash = await bcrypt.hash(password, email);
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
    const { url, state } = await provider.getAuthorizationRedirect();
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
      user: { id: providerId, email },
    } = await provider.getAuthorizationResult(code);
    // Guaranteed unique
    const existingUser = await this._db.user.findFirst({
      where: {
        oauthProviders: {
          some: {
            providerId,
            providerName,
          },
        },
      },
    });
    if (existingUser) return this._authenticateUser(existingUser);

    const user = await this._userService.createUserWithOAuthProvider(
      email,
      providerName,
      providerId,
    );
    return this._authenticateUser(user);
  }

  _getStateCookieName(providerName: string): string {
    return `${providerName}_oauth_state`;
  }

  _authenticateUser(user: User): Promise<Response> {
    throw new Error("Not implemented yet!");
  }
}
