import { jest } from "@jest/globals";
import type { ILoggerService } from "@app/services/types/ILoggerService";

export const mockLoggerService: ILoggerService = {
  debug: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};
