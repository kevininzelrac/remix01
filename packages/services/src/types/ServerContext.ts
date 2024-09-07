import type { ILoggerService } from "./ILoggerService.js";
import type { IOAuthProviderFactoryService } from "./IOAuthProviderFactoryService.js";
import type { IMailService } from "./IMailService.js";
import type { IClockService } from "./IClockService.js";
import type { IFileSystemService } from "./IFileSystemService.js";
import type { IProductService } from "./IProductService.js";
import type { DatabaseService } from "../db/DatabaseService.js";
import type { UserService } from "../models/UserService.js";
import type { RequestService } from "../request/RequestService.js";
import { SessionService } from "../session/SessionService.js";

export type ServerContext = {
  requestService: RequestService;
  databaseService: DatabaseService;
  clockService: IClockService;
  fileSystemService: IFileSystemService;
  loggerService: ILoggerService;
  mailService: IMailService;
  oauthProviderFactoryService: IOAuthProviderFactoryService;
  productService: IProductService;
  sessionService: SessionService;
  userService: UserService;
};
