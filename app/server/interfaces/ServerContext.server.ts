import type { WithDependency } from "~/server/injection";
import type { ILoggerService } from "./ILoggerService.server";
import type { IUserService } from "./IUserService.server";
import { IPostService } from "./IPostService.server";

export type ServerContext = WithDependency<{
  loggerService: ILoggerService;
  userService: IUserService;
  postService: IPostService;
}>;
