import type { WithDependency } from "~/server/injection";
import type { ILoggerService } from "./ILoggerService.server";
import type { IUserService } from "./IUserService.server";
import type { ISessionService } from "./ISessionService.server";
import type { IOAuthProviderFactoryService } from "./IOAuthProviderFactoryService.server";
import type { IMailService } from "./IMailService.server";

export type ServerContext = WithDependency<{
  loggerService: ILoggerService;
  userService: IUserService;
  sessionService: ISessionService;
  oauthProviderFactoryService: IOAuthProviderFactoryService;
  mailService: IMailService;
}>;
