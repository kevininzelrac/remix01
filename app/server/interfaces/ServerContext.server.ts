import type { WithDependency } from "~/server/injection";
import type { ILoggerService } from "./ILoggerService.server";
import type { IUserService } from "./IUserService.server";

export type ServerContext = WithDependency<{
  loggerService: ILoggerService;
  userService: IUserService;
}>;
