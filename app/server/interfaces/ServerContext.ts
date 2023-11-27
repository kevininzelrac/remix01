import type { WithDependency } from "~/server/injection";
import type { ILoggerService } from "./ILoggerService";
import type { IUserService } from "./IUserService";

export type ServerContext = WithDependency<{
  loggerService: ILoggerService;
  userService: IUserService;
}>;
