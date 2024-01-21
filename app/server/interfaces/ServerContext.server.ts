import type { WithDependency } from "~/server/injection";
import type { ILoggerService } from "./ILoggerService.server";
import type { IUserService } from "./IUserService.server";
import type { IPostService } from "./IPostService.server";
import type { ISessionService } from "./ISessionService.server";
import type { IOAuthProviderFactoryService } from "./IOAuthProviderFactoryService.server";

export type ServerContext = WithDependency<{
  loggerService: ILoggerService;
  userService: IUserService;
  postService: IPostService;
  sessionService: ISessionService;
  oauthProviderFactoryService: IOAuthProviderFactoryService;
}>;
