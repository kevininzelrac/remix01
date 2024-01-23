import type { Auth } from "lucia";
import type { GoogleAuth, GoogleUser } from "@lucia-auth/oauth/providers";
import { google } from "@lucia-auth/oauth/providers";

import { PAGES } from "~/constants";
import type { Dependency } from "~/server/injection";
import type {
  OAuthRedirect,
  OAuthResult,
  IOAuthProviderService,
  ServerContext,
} from "~/server/interfaces";
import { BASE_URL } from "~/server/constants.server";

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
      redirectUri: new URL(
        PAGES.AUTH_CALLBACK_API(_providerName),
        BASE_URL,
      ).toString(),
    });
  }

  init(context: ServerContext): void {}

  async getOAuthRedirect(): Promise<OAuthRedirect> {
    const [url, state] = await this._provider.getAuthorizationUrl();
    return {
      url: url.toString(),
      state,
    };
  }

  async getOAuthResult(code: string): Promise<OAuthResult<GoogleUser>> {
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
        fullName: googleUser.name,
        avatar: googleUser.picture,
      },
      profile: googleUser,
    };
  }
}
