import type { Dependency } from "~/server/injection";
import type { ILoggerService, ServerContext } from "~/server/interfaces";

export const mockLoggerService: ILoggerService & Dependency<ServerContext> = {
  init: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};
