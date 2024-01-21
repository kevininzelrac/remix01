import { lucia } from "lucia";
import { web } from "lucia/middleware";
import { parseCookie, serializeCookie } from "lucia/utils";

import type {
  IOAuthProviderFactoryService,
  ISessionService,
  RedirectToOAuthProviderResult,
  ServerContext,
} from "~/server/interfaces";
import type { Dependency } from "~/server/injection";

const auth = lucia({
  env: "DEV",
  adapter: null as any,
  middleware: web(),
});

export class SessionService
  implements ISessionService, Dependency<ServerContext>
{
  oauthProviderFactoryService!: IOAuthProviderFactoryService;

  init(context: ServerContext): void {
    this.oauthProviderFactoryService = context.oauthProviderFactoryService;
  }

  async redirectToOAuthProvider(
    providerName: string,
  ): Promise<RedirectToOAuthProviderResult> {
    const provider = this.oauthProviderFactoryService.getProvider(providerName);
    const { url, state } = await provider.getAuthorizationRedirect();
    const stateCookie = serializeCookie(
      this._getStateCookieName(providerName),
      state,
      {
        httpOnly: true,
        secure: false, // `true` for production
        path: "/",
        maxAge: 60 * 60,
      },
    );
    return {
      url,
      stateCookie,
    };
  }

  async handleOAuthResult(providerName: string, request: Request) {
    const provider = this.oauthProviderFactoryService.getProvider(providerName);

    const cookies = parseCookie(request.headers.get("Cookie") ?? "");
    const storedState = cookies[this._getStateCookieName(providerName)];
    const url = new URL(request.url);
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");

    // validate state
    if (!storedState || !state || storedState !== state || !code) {
      throw new Error("Invalid State");
    }

    const { id: providerId } = await provider.getAuthorizationResult(code);
  }

  _getStateCookieName(providerName: string): string {
    return `${providerName}_oauth_state`;
  }
}
