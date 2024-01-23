import type { Auth } from "lucia";
import type { FacebookAuth, FacebookUser } from "@lucia-auth/oauth/providers";
import { facebook } from "@lucia-auth/oauth/providers";

import { PAGES } from "~/constants";
import type { Dependency } from "~/server/injection";
import type {
  OAuthRedirect,
  OAuthResult,
  IOAuthProviderService,
  ServerContext,
} from "~/server/interfaces";
import { BASE_URL } from "~/server/constants.server";

export class FacebookOAuthProviderService
  implements IOAuthProviderService, Dependency<ServerContext>
{
  private _provider: FacebookAuth;

  constructor(
    private _providerName: string,
    clientId: string,
    clientSecret: string,
    auth: Auth,
  ) {
    this._provider = facebook(auth, {
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

  async getOAuthResult(code: string): Promise<OAuthResult<FacebookUser>> {
    const { facebookUser } = await this._provider.validateCallback(code);
    if (!facebookUser.email) {
      throw new Error("Could not link account. Email not provider.");
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
