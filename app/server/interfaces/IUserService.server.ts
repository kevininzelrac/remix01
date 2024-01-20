import type { User } from "~/server/db/interfaces.server";

export interface IUserService {
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  getByEmailPasswordCombination(
    email: string,
    password: string,
  ): Promise<User | null>;
  putNewUser(
    firstname: string,
    lastname: string,
    email: string,
    passwordHash: string,
  ): Promise<{ email: String; passwordHash: string } | null>;
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
