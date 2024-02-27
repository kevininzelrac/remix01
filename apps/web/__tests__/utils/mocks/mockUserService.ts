import type { IUserService } from "~/server/interfaces";

export const mockUserService: IUserService = {
  getById: jest.fn(),
  getByEmail: jest.fn(),
};
