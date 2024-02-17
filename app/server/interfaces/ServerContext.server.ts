import type { ILoggerService } from "./ILoggerService.server";
import type { IUserService } from "./IUserService.server";
import type { ISessionService } from "./ISessionService.server";
import type { IOAuthProviderFactoryService } from "./IOAuthProviderFactoryService.server";
import type { IMailService } from "./IMailService.server";
import type { IClockService } from "./IClockService.server";
import type { IFileSystemService } from "./IFileSystemService.server";
import type { DatabaseClient } from "../db/interfaces.server";

export type ServerContext = {
  db: DatabaseClient;
  clockService: IClockService;
  fileSystemService: IFileSystemService;
  loggerService: ILoggerService;
  mailService: IMailService;
  oauthProviderFactoryService: IOAuthProviderFactoryService;
  sessionService: ISessionService;
  userService: IUserService;
};
