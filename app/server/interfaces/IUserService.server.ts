import type { User } from "~/server/db/interfaces.server";

export interface IUserService {
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  getByOAuthProvider(
    providerName: string,
    providerId: string,
  ): Promise<User | null>;
  createUserWithPassword(email: string, passwordHash: string): Promise<User>;
  createUserWithOAuthProvider(
    email: string,
    providerName: string,
    providerId: string,
    attributes: Pick<User, "fullName" | "avatar" | "emailVerifiedAt">,
  ): Promise<User>;
  updateUser(
    id: string,
    attrs: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>,
  ): Promise<User>;
}
