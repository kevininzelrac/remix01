import type { Auth } from "lucia";
import type { GoogleAuth, GoogleUser } from "@lucia-auth/oauth/providers";
import { google } from "@lucia-auth/oauth/providers";

import { pages } from "~/constants";
import type { Dependency } from "~/server/injection";
import type {
  AuthorizationRedirect,
  AuthorizationResult,
  IOAuthProviderService,
  ServerContext,
} from "~/server/interfaces";

export class GoogleOAuthProviderService
  implements IOAuthProviderService, Dependency<ServerContext>
{
  private _provider: GoogleAuth;

  constructor(
    private _providerName: string,
    clientId: string,
    clientSecret: string,
    auth: Auth,
  ) {
    this._provider = google(auth, {
      clientId,
      clientSecret,
      redirectUri: pages.AUTH_CALLBACK_API(_providerName),
    });
  }

  init(context: ServerContext): void {}

  async getAuthorizationRedirect(): Promise<AuthorizationRedirect> {
    const [url, state] = await this._provider.getAuthorizationUrl();
    return {
      url: url.toString(),
      state,
    };
  }

  async getAuthorizationResult(
    code: string,
  ): Promise<AuthorizationResult<GoogleUser>> {
    const { googleUser } = await this._provider.validateCallback(code);
    if (!googleUser.email) {
      throw new Error("Could not link account. Email not provider.");
    }
    return {
      user: {
        id: googleUser.sub,
        provider: this._providerName,
        email: googleUser.email,
        emailVerified: googleUser.email_verified ?? false,
      },
      profile: googleUser,
    };
  }
}
