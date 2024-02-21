import { getConsoleLoggerService } from "./logger/ConsoleLoggerService.server";
import { getUserService } from "./models/UserService.server";
import { getSessionService } from "./session/SessionService.server";
import { getOAuthProviderFactoryService } from "./session/OAuthProviderFactoryService.server";
import { getLocalMailService } from "./mail/LocalMailService.server";
import { getClockService } from "./clock/ClockService.server";
import { getLocalFileSystemService } from "./fs/LocalFileSystemService.server";
import { getDatabaseService } from "./db/DatabaseService.server";
import { Container, RegistrationLifetime } from "./container.server";
import { getLocalProductService } from "./pricing";

export const serverContainer = new Container();

serverContainer.register(
  "clockService",
  getClockService,
  RegistrationLifetime.SINGLETON,
);

serverContainer.register(
  "fileSystemService",
  getLocalFileSystemService,
  RegistrationLifetime.SINGLETON,
);

serverContainer.register(
  "loggerService",
  getConsoleLoggerService,
  RegistrationLifetime.SINGLETON,
);

serverContainer.register(
  "mailService",
  getLocalMailService,
  RegistrationLifetime.SINGLETON,
);

serverContainer.register(
  "oauthProviderFactoryService",
  getOAuthProviderFactoryService,
  RegistrationLifetime.SINGLETON,
);

serverContainer.register(
  "databaseService",
  getDatabaseService,
  RegistrationLifetime.SCOPED,
);

serverContainer.register(
  "sessionService",
  getSessionService,
  RegistrationLifetime.SCOPED,
);

serverContainer.register(
  "userService",
  getUserService,
  RegistrationLifetime.SCOPED,
);

serverContainer.register(
  "productService",
  getLocalProductService,
  RegistrationLifetime.SINGLETON,
);
