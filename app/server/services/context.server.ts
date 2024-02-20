import * as awilix from "awilix";

import type { ServerContext } from "~/server/interfaces";
import { getConsoleLoggerService } from "./logger/ConsoleLoggerService.server";
import { getUserService } from "./models/UserService.server";
import { getSessionService } from "./session/SessionService.server";
import { getOAuthProviderFactoryService } from "./session/OAuthProviderFactoryService.server";
import { getLocalMailService } from "./mail/LocalMailService.server";
import { getClockService } from "./clock/ClockService.server";
import { getLocalFileSystemService } from "./fs/LocalFileSystemService.server";

export const container = awilix.createContainer<ServerContext>({
  injectionMode: awilix.InjectionMode.PROXY,
  strict: true,
});

container.register({
  clockService: awilix.asFunction(getClockService).singleton(),
  fileSystemService: awilix.asFunction(getLocalFileSystemService).singleton(),
  loggerService: awilix.asFunction(getConsoleLoggerService).singleton(),
  mailService: awilix.asFunction(getLocalMailService).singleton(),
  oauthProviderFactoryService: awilix
    .asFunction(getOAuthProviderFactoryService)
    .singleton(),
  sessionService: awilix.asFunction(getSessionService).scoped(),
  userService: awilix.asFunction(getUserService).scoped(),
});
