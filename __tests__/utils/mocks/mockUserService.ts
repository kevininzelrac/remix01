import type { Dependency } from "~/server/injection";
import type { IUserService, ServerContext } from "~/server/interfaces";

export const mockUserService: IUserService & Dependency<ServerContext> = {
  init: jest.fn(),
  getById: jest.fn(),
  getByEmail: jest.fn(),
  getByEmailPasswordCombination: jest.fn(),
};
