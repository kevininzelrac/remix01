export type AuthorizationRedirect = {
  url: string;
  state: string;
};

export type AuthorizationResult<Profile = unknown> = {
  id: string;
  profile: Profile;
};

export interface IOAuthProviderService<Profile = unknown> {
  getAuthorizationRedirect(): Promise<AuthorizationRedirect>;
  getAuthorizationResult(code: string): Promise<AuthorizationResult<Profile>>;
}
