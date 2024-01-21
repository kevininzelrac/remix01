import type { User } from "~/server/db/interfaces.server";

export interface IUserService {
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  createUserWithPassword(email: string, passwordHash: string): Promise<User>;
  createUserWithOAuthProvider(
    email: string,
    providerName: string,
    providerId: string,
  ): Promise<User>;
  putRefreshToken(userId: string, token: string): Promise<string | null>;
  getRefreshToken(userId: string, token: string): Promise<string | null>;
  revokeRefreshToken(userId: string, token: string): Promise<void>;
  signGoogleUser(
    id: string,
    email: string,
    firstname: string,
    lastname: string,
    avatar: string,
  ): Promise<User | null>;
}
