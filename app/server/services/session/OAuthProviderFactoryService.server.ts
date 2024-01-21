import type { Auth } from "lucia";
import { lucia } from "lucia";
import { web } from "lucia/middleware";

import type { Dependency } from "~/server/injection";
import type {
  IOAuthProviderFactoryService,
  IOAuthProviderService,
  ServerContext,
} from "~/server/interfaces";
import {
  FacebookOAuthProviderService,
  GithubOAuthProviderService,
  GoogleOAuthProviderService,
} from "./providers";
import {
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "~/server/constants.server";

export class OAuthProviderFactoryService
  implements IOAuthProviderFactoryService, Dependency<ServerContext>
{
  private auth: Auth;
  private providers: Record<string, IOAuthProviderService | undefined>;

  constructor() {
    this.auth = lucia({
      env: "DEV",
      adapter: null as any,
      middleware: web(),
    });
    this.providers = {
      facebook: new FacebookOAuthProviderService(
        "facebook",
        FACEBOOK_CLIENT_ID,
        FACEBOOK_CLIENT_SECRET,
        this.auth,
      ),
      github: new GithubOAuthProviderService(
        "github",
        GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET,
        this.auth,
      ),
      google: new GoogleOAuthProviderService(
        "google",
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        this.auth,
      ),
    };
  }

  init(context: ServerContext) {}

  getProvider(providerName: string): IOAuthProviderService {
    const provider = this.providers[providerName];
    if (!provider)
      throw new Error(`OAuth provider ${providerName} does not exist.`);
    return provider;
  }
}
