import type { ILoggerService } from "~/server/interfaces";

export const mockLoggerService: ILoggerService = {
  debug: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};
