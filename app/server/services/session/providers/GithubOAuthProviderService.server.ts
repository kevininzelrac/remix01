import type { Auth } from "lucia";
import type { GithubAuth, GithubUser } from "@lucia-auth/oauth/providers";
import { github } from "@lucia-auth/oauth/providers";

import { PAGES } from "~/constants";
import type { Dependency } from "~/server/injection";
import type {
  OAuthRedirect,
  OAuthResult,
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

  async getOAuthResult(code: string): Promise<OAuthResult<GithubUser>> {
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
        fullName: githubUser.name ?? undefined,
        avatar: githubUser.avatar_url,
      },
      profile: githubUser,
    };
  }
}
