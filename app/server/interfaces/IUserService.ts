import type { User } from "~/server/db/interfaces";

export interface IUserService {
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  getByEmailPasswordCombination(
    email: string,
    password: string,
  ): Promise<User | null>;
}
