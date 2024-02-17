import type { Auth, KeySchema } from "lucia";
import { lucia } from "lucia";
import { web } from "lucia/middleware";

import type {
  IOAuthProviderFactoryService,
  IOAuthProviderService,
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

const adapter = {
  async getSession(sessionId: string): Promise<any> {},
  async getSessionsByUserId(userId: string): Promise<any[]> {
    return [];
  },
  async setSession(session: any): Promise<void> {},
  async updateSession(
    sessionId: string,
    partialSession: Partial<any>,
  ): Promise<void> {},
  async deleteSession(sessionId: string): Promise<void> {},
  async deleteSessionsByUserId(userId: string): Promise<void> {},
  async getUser(userId: string): Promise<any> {},
  async setUser(user: any, key: KeySchema | null): Promise<void> {},
  async updateUser(userId: string, partialUser: Partial<any>): Promise<void> {},
  async deleteUser(userId: string): Promise<void> {},
  async getKey(keyId: string): Promise<KeySchema | null> {
    return null;
  },
  async getKeysByUserId(userId: string): Promise<KeySchema[]> {
    return [];
  },
  async setKey(key: KeySchema): Promise<void> {},
  async updateKey(
    keyId: string,
    partialKey: Partial<KeySchema>,
  ): Promise<void> {},
  async deleteKey(keyId: string): Promise<void> {},
  async deleteKeysByUserId(userId: string): Promise<void> {},
};

export class OAuthProviderFactoryService
  implements IOAuthProviderFactoryService
{
  private auth: Auth;
  private providers: Record<string, IOAuthProviderService | undefined>;

  constructor() {
    this.auth = lucia({
      env: "DEV",
      adapter: () => adapter,
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

  getProvider(providerName: string): IOAuthProviderService {
    const provider = this.providers[providerName];
    if (!provider)
      throw new Error(`OAuth provider ${providerName} does not exist.`);
    return provider;
  }
}
