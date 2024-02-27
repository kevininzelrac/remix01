import type { ILoggerService } from "./ILoggerService.server";
import type { IUserService } from "./IUserService.server";
import type { ISessionService } from "./ISessionService.server";
import type { IOAuthProviderFactoryService } from "./IOAuthProviderFactoryService.server";
import type { IMailService } from "./IMailService.server";
import type { IClockService } from "./IClockService.server";
import type { IFileSystemService } from "./IFileSystemService.server";
import type { IDatabaseService } from "./IDatabaseService.server";
import type { IProductService } from "./IProductService.server";

export type ServerContext = {
  request: Request;
  databaseService: IDatabaseService;
  clockService: IClockService;
  fileSystemService: IFileSystemService;
  loggerService: ILoggerService;
  mailService: IMailService;
  oauthProviderFactoryService: IOAuthProviderFactoryService;
  productService: IProductService;
  sessionService: ISessionService;
  userService: IUserService;
};