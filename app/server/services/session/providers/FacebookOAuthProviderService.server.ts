import type { Auth } from "lucia";
import type { FacebookAuth, FacebookUser } from "@lucia-auth/oauth/providers";
import { facebook } from "@lucia-auth/oauth/providers";

import { pages } from "~/constants";
import type { Dependency } from "~/server/injection";
import type {
  AuthorizationRedirect,
  AuthorizationResult,
  IOAuthProviderService,
  ServerContext,
} from "~/server/interfaces";

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
  ): Promise<AuthorizationResult<FacebookUser>> {
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
      },
      profile: facebookUser,
    };
  }
}
