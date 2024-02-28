import type { Auth } from "lucia";
import type { GithubAuth, GithubUser } from "@lucia-auth/oauth/providers";
import { github } from "@lucia-auth/oauth/providers";

import type {
  OAuthRedirect,
  OAuthResult,
  IOAuthProviderService,
} from "~/types/IOAuthProviderService";
import { NotAuthenticatedError } from "@app/utils/errors";

export class GithubOAuthProviderService implements IOAuthProviderService {
  private _provider: GithubAuth;

  constructor(
    private _providerName: string,
    clientId: string,
    clientSecret: string,
    redirectUri: URL,
    auth: Auth,
  ) {
    this._provider = github(auth, {
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

  async getOAuthResult(code: string): Promise<OAuthResult<GithubUser>> {
    const { githubUser } = await this._provider.validateCallback(code);
    if (!githubUser.email) {
      throw new NotAuthenticatedError(
        "Could not link account. Email not provided.",
      );
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
