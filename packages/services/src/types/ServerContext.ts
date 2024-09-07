import type { ILoggerService } from "./ILoggerService.js";
import type { IUserService } from "./IUserService.js";
import type { ISessionService } from "./ISessionService.js";
import type { IOAuthProviderFactoryService } from "./IOAuthProviderFactoryService.js";
import type { IMailService } from "./IMailService.js";
import type { IClockService } from "./IClockService.js";
import type { IFileSystemService } from "./IFileSystemService.js";
import type { IDatabaseService } from "./IDatabaseService.js";
import type { IProductService } from "./IProductService.js";
import type { IRequestService } from "./IRequestService.js";

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
