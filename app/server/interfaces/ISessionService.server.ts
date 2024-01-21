export type RedirectToOAuthProviderResult = {
  url: string;
  stateCookie: string;
};

export interface ISessionService {
  redirectToOAuthProvider(
    providerName: string,
  ): Promise<RedirectToOAuthProviderResult>;
}
