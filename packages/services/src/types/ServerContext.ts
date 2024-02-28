import type { ILoggerService } from "./ILoggerService";
import type { IUserService } from "./IUserService";
import type { ISessionService } from "./ISessionService";
import type { IOAuthProviderFactoryService } from "./IOAuthProviderFactoryService";
import type { IMailService } from "./IMailService";
import type { IClockService } from "./IClockService";
import type { IFileSystemService } from "./IFileSystemService";
import type { IDatabaseService } from "./IDatabaseService";
import type { IProductService } from "./IProductService";
import type { IRequestService } from "./IRequestService";

export type ServerContext = {
  requestService: IRequestService;
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
