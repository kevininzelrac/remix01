import type { Auth, KeySchema } from "lucia";
import { lucia } from "lucia";
import { web } from "lucia/middleware";

import type { IOAuthProviderFactoryService } from "~/server/interfaces/IOAuthProviderFactoryService.server";
import type { IOAuthProviderService } from "~/server/interfaces/IOAuthProviderService.server";

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
  NODE_ENV,
} from "~/server/constants.server";

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

const auth = lucia({
  env: NODE_ENV === "production" ? "PROD" : "DEV",
  adapter: () => adapter,
  middleware: web(),
});

const providers = {
  facebook: new FacebookOAuthProviderService(
    "facebook",
    FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET,
    auth,
  ),
  github: new GithubOAuthProviderService(
    "github",
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    auth,
  ),
  google: new GoogleOAuthProviderService(
    "google",
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    auth,
  ),
};

export const getOAuthProviderFactoryService = () => {
  return new OAuthProviderFactoryService(auth, providers);
};
