import type { Auth, KeySchema } from "lucia";
import { lucia } from "lucia";
import { web } from "lucia/middleware";

import type { IOAuthProviderFactoryService } from "~/types/IOAuthProviderFactoryService";
import type { IOAuthProviderService } from "~/types/IOAuthProviderService";

import { FacebookOAuthProviderService } from "./providers/FacebookOAuthProviderService";
import { GithubOAuthProviderService } from "./providers/GithubOAuthProviderService";
import { GoogleOAuthProviderService } from "./providers/GoogleOAuthProviderService";

const adapter = {
  async getSession(): Promise<void> {},
  async getSessionsByUserId(): Promise<unknown[]> {
    return [];
  },
  async setSession(): Promise<void> {},
  async updateSession(): Promise<void> {},
  async deleteSession(): Promise<void> {},
  async deleteSessionsByUserId(): Promise<void> {},
  async getUser(): Promise<void> {},
  async setUser(): Promise<void> {},
  async updateUser(): Promise<void> {},
  async deleteUser(): Promise<void> {},
  async getKey(): Promise<KeySchema | null> {
    return null;
  },
  async getKeysByUserId(): Promise<KeySchema[]> {
    return [];
  },
  async setKey(): Promise<void> {},
  async updateKey(): Promise<void> {},
  async deleteKey(): Promise<void> {},
  async deleteKeysByUserId(): Promise<void> {},
};

export class OAuthProviderFactoryService
  implements IOAuthProviderFactoryService
{
  constructor(
    private auth: Auth,
    private providers: Record<string, IOAuthProviderService | undefined>,
  ) {}

  getProvider(providerName: string): IOAuthProviderService {
    const provider = this.providers[providerName];
    if (!provider)
      throw new Error(`OAuth provider ${providerName} does not exist.`);
    return provider;
  }
}

export type OAuthProviderConfiguration = {
  clientId: string;
  clientSecret: string;
  redirectUri: URL;
};

export type OAuthProviderFactoryServiceOptions = {
  env: string;
  providers: {
    facebook?: OAuthProviderConfiguration;
    github?: OAuthProviderConfiguration;
    google?: OAuthProviderConfiguration;
  };
};

export const getOAuthProviderFactoryService = ({
  env,
  providers: { github, google, facebook },
}: OAuthProviderFactoryServiceOptions) => {
  const auth = lucia({
    env: env === "production" ? "PROD" : "DEV",
    adapter: () => adapter,
    middleware: web(),
  });

  const providers: Record<string, IOAuthProviderService | undefined> = {};

  if (facebook) {
    providers.facebook = new FacebookOAuthProviderService(
      "facebook",
      facebook.clientId,
      facebook.clientSecret,
      facebook.redirectUri,
      auth,
    );
  }

  if (github) {
    providers.github = new GithubOAuthProviderService(
      "github",
      github.clientId,
      github.clientSecret,
      github.redirectUri,
      auth,
    );
  }

  if (google) {
    providers.google = new GoogleOAuthProviderService(
      "google",
      google.clientId,
      google.clientSecret,
      google.redirectUri,
      auth,
    );
  }

  return () => {
    return new OAuthProviderFactoryService(auth, providers);
  };
};
