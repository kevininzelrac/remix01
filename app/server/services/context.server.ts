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

export const serverContainer = getServerContainer();

// Change the logic here to determine what container gets injected
function getServerContainer(): Container {
  const container = new Container();

  container.register(
    "clockService",
    getClockService,
    RegistrationLifetime.SINGLETON,
  );

  container.register(
    "fileSystemService",
    getLocalFileSystemService,
    RegistrationLifetime.SINGLETON,
  );

  container.register(
    "loggerService",
    getConsoleLoggerService,
    RegistrationLifetime.SINGLETON,
  );

  container.register(
    "mailService",
    getLocalMailService,
    RegistrationLifetime.SINGLETON,
  );

  container.register(
    "oauthProviderFactoryService",
    getOAuthProviderFactoryService,
    RegistrationLifetime.SINGLETON,
  );

  container.register(
    "databaseService",
    getDatabaseService,
    RegistrationLifetime.SCOPED,
  );

  container.register(
    "sessionService",
    getSessionService,
    RegistrationLifetime.SCOPED,
  );

  container.register(
    "userService",
    getUserService,
    RegistrationLifetime.SCOPED,
  );

  container.register(
    "productService",
    getLocalProductService,
    RegistrationLifetime.SCOPED,
  );

  return container;
}
