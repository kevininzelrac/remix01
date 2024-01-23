export type OAuthRedirect = {
  url: string;
  state: string;
};

export type OAuthResult<Profile = unknown> = {
  user: {
    id: string;
    provider: string;
    email: string;
    emailVerified: boolean;
    firstName?: string;
    lastName?: string;
  };
  profile: Profile;
};

export interface IOAuthProviderService<Profile = unknown> {
  getOAuthRedirect(): Promise<OAuthRedirect>;
  getOAuthResult(code: string): Promise<OAuthResult<Profile>>;
}
