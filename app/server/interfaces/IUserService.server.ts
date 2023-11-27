import type { User } from "~/server/db/interfaces.server";

export interface IUserService {
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  getByEmailPasswordCombination(
    email: string,
    password: string
  ): Promise<User | null>;
  putRefreshToken(userId: string, token: string): Promise<string | null>;
  getRefreshToken(userId: string, token: string): Promise<string | null>;
}
