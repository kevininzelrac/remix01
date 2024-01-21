import type { Auth } from "lucia";
import type { GithubAuth, GithubUser } from "@lucia-auth/oauth/providers";
import { github } from "@lucia-auth/oauth/providers";

import { pages } from "~/constants";
import type { Dependency } from "~/server/injection";
import type {
  AuthorizationRedirect,
  AuthorizationResult,
  IOAuthProviderService,
  ServerContext,
} from "~/server/interfaces";

export class GithubOAuthProviderService
  implements IOAuthProviderService, Dependency<ServerContext>
{
  private provider: GithubAuth;

  constructor(
    providerName: string,
    clientId: string,
    clientSecret: string,
    auth: Auth,
  ) {
    this.provider = github(auth, {
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
  ): Promise<AuthorizationResult<GithubUser>> {
    const { githubUser } = await this.provider.validateCallback(code);
    return {
      id: String(githubUser.id),
      profile: githubUser,
    };
  }
}
