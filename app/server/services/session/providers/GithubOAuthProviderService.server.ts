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
import { BASE_URL } from "~/server/constants.server";

export class GithubOAuthProviderService
  implements IOAuthProviderService, Dependency<ServerContext>
{
  private _provider: GithubAuth;

  constructor(
    private _providerName: string,
    clientId: string,
    clientSecret: string,
    auth: Auth,
  ) {
    this._provider = github(auth, {
      clientId,
      clientSecret,
      redirectUri: new URL(
        pages.AUTH_CALLBACK_API(_providerName),
        BASE_URL,
      ).toString(),
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
  ): Promise<AuthorizationResult<GithubUser>> {
    const { githubUser } = await this._provider.validateCallback(code);
    if (!githubUser.email) {
      throw new Error("Could not link account. Email not provider.");
    }
    return {
      user: {
        id: String(githubUser.id),
        provider: this._providerName,
        email: githubUser.email,
        emailVerified: false,
      },
      profile: githubUser,
    };
  }
}
