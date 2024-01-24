import type { WithDependency } from "~/server/injection";
import type { ILoggerService } from "./ILoggerService.server";
import type { IUserService } from "./IUserService.server";
import type { ISessionService } from "./ISessionService.server";
import type { IOAuthProviderFactoryService } from "./IOAuthProviderFactoryService.server";
import type { IMailService } from "./IMailService.server";
import type { IClockService } from "./IClockService.server";

export type ServerContext = WithDependency<{
  clockService: IClockService;
  loggerService: ILoggerService;
  mailService: IMailService;
  oauthProviderFactoryService: IOAuthProviderFactoryService;
  sessionService: ISessionService;
  userService: IUserService;
}>;
