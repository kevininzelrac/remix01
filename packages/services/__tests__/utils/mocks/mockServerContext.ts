import type { ServerContext } from "../../../src/types/ServerContext.js";
import { mockLoggerService } from "./mockLoggerService.js";

export const mockServerContext: ServerContext = {
  loggerService: mockLoggerService,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;
