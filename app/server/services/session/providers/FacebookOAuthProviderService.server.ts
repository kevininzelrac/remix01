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
  private provider: FacebookAuth;

  constructor(
    providerName: string,
    clientId: string,
    clientSecret: string,
    auth: Auth,
  ) {
    this.provider = facebook(auth, {
      clientId,
      clientSecret,
      redirectUri: pages.AUTH_CALLBACK_API(providerName),
    });
  }

  init(context: ServerContext): void {}

  async getAuthorizationRedirect(): Promise<AuthorizationRedirect> {
    const [url, state] = await this.provider.getAuthorizationUrl();
    return {
      url: url.toString(),
      state,
    };
  }

  async getAuthorizationResult(
    code: string,
  ): Promise<AuthorizationResult<FacebookUser>> {
    const { facebookUser } = await this.provider.validateCallback(code);
    return {
      id: facebookUser.id,
      profile: facebookUser,
    };
  }
}
