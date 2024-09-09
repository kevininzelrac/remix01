import { jest } from "@jest/globals";

import type { ILoggerService } from "../../../src/types/ILoggerService.js";

export const mockLoggerService: ILoggerService = {
  debug: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};
