import type { Auth } from "lucia";
import type { GoogleAuth, GoogleUser } from "@lucia-auth/oauth/providers";
import { google } from "@lucia-auth/oauth/providers";

import { pages } from "~/constants";
import type { Dependency } from "~/server/injection";
import type {
  AuthorizationRedirect,
  AuthorizationResult,
  IOAuthProviderService,
  ServerContext,
} from "~/server/interfaces";

export class GoogleOAuthProviderService
  implements IOAuthProviderService, Dependency<ServerContext>
{
  private provider: GoogleAuth;

  constructor(
    providerName: string,
    clientId: string,
    clientSecret: string,
    auth: Auth,
  ) {
    this.provider = google(auth, {
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
  ): Promise<AuthorizationResult<GoogleUser>> {
    const { googleUser } = await this.provider.validateCallback(code);
    return {
      id: googleUser.sub,
      profile: googleUser,
    };
  }
}
