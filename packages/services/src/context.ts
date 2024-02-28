import { getConsoleLoggerService } from "./logger/ConsoleLoggerService";
import { getUserService } from "./models/UserService";
import { getSessionService } from "./session/SessionService";
import { getOAuthProviderFactoryService } from "./session/OAuthProviderFactoryService";
import { getLocalMailService } from "./mail/LocalMailService";
import { getClockService } from "./clock/ClockService";
import { getLocalFileSystemService } from "./fs/LocalFileSystemService";
import { getDatabaseService } from "./db/DatabaseService";
import { getLocalProductService } from "./pricing/LocalProductService";
import { Container, RegistrationLifetime } from "./container";

export const serverContainer = getServerContainer();

// Change the logic here to determine what container gets injected
function getServerContainer(): Container {
  const container = new Container();

  container.register(
    "clockService",
    getClockService(),
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
