import type { ServerContext } from "~/server/interfaces";
import { mockLoggerService } from "./mockLoggerService";
import { mockUserService } from "./mockUserService";

export const mockServerContext: ServerContext = {
  loggerService: mockLoggerService,
  userService: mockUserService,
};
