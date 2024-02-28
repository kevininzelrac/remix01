import type { Auth } from "lucia";
import type { GoogleAuth, GoogleUser } from "@lucia-auth/oauth/providers";
import { google } from "@lucia-auth/oauth/providers";

import type {
  OAuthRedirect,
  OAuthResult,
  IOAuthProviderService,
} from "~/types/IOAuthProviderService";
import { NotAuthenticatedError } from "@app/utils/errors";

export class GoogleOAuthProviderService implements IOAuthProviderService {
  private _provider: GoogleAuth;

  constructor(
    private _providerName: string,
    clientId: string,
    clientSecret: string,
    redirectUri: URL,
    auth: Auth,
  ) {
    this._provider = google(auth, {
      clientId,
      clientSecret,
      redirectUri: redirectUri.toString(),
    });
  }

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
      throw new NotAuthenticatedError(
        "Could not link account. Email not provided.",
      );
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
