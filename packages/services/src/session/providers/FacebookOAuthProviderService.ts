import type { Auth } from "lucia";
import type { FacebookAuth, FacebookUser } from "@lucia-auth/oauth/providers";
import { facebook } from "@lucia-auth/oauth/providers";

import type {
  OAuthRedirect,
  OAuthResult,
  IOAuthProviderService,
} from "~/types/IOAuthProviderService";
import { NotAuthenticatedError } from "@app/utils/errors";

export class FacebookOAuthProviderService implements IOAuthProviderService {
  private _provider: FacebookAuth;

  constructor(
    private _providerName: string,
    clientId: string,
    clientSecret: string,
    redirectUri: URL,
    auth: Auth,
  ) {
    this._provider = facebook(auth, {
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

  async getOAuthResult(code: string): Promise<OAuthResult<FacebookUser>> {
    const { facebookUser } = await this._provider.validateCallback(code);
    if (!facebookUser.email) {
      throw new NotAuthenticatedError(
        "Could not link account. Email not provided.",
      );
    }
    return {
      user: {
        id: facebookUser.id,
        provider: this._providerName,
        email: facebookUser.email,
        emailVerified: false,
        fullName: facebookUser.name,
        avatar: facebookUser.picture.data.url,
      },
      profile: facebookUser,
    };
  }
}
