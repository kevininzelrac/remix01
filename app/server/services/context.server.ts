import * as awilix from "awilix";

import type { ServerContext } from "~/server/interfaces";
import { LoggerService } from "./LoggerService.server";
import { UserService } from "./UserService.server";
import { SessionService } from "./session/SessionService.server";
import { OAuthProviderFactoryService } from "./session/OAuthProviderFactoryService.server";
import { MailService } from "./mail/MailService.server";
import { ClockService } from "./IClockService.server";
import { transport } from "./dependencies.server";
import { DEFAULT_MAIL_FROM } from "../constants.server";
import { LocalFileSystemService } from "./fs/LocalFileSystemService.server";

export const container = awilix.createContainer<ServerContext>({
  injectionMode: awilix.InjectionMode.PROXY,
  strict: true,
});

container.register({
  clockService: awilix.asValue(new ClockService()),
  fileSystemService: awilix.asValue(new LocalFileSystemService("./.data")),
  loggerService: awilix.asValue(new LoggerService()),
  mailService: awilix.asValue(new MailService(transport, DEFAULT_MAIL_FROM)),
  oauthProviderFactoryService: awilix.asValue(
    new OAuthProviderFactoryService(),
  ),
  sessionService: awilix
    .asFunction((context: ServerContext) => {
      return new SessionService(
        context.db,
        context.clockService,
        context.loggerService,
        context.mailService,
        context.oauthProviderFactoryService,
        context.userService,
      );
    })
    .scoped(),
  userService: awilix
    .asFunction((context: ServerContext) => {
      return new UserService(context.db, context.loggerService);
    })
    .scoped(),
});
