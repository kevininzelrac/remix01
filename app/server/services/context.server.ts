import type { ServerContext } from "~/server/interfaces";
import { buildServerContext } from "~/server/injection";
import { LoggerService } from "./LoggerService.server";
import { UserService } from "./UserService.server";
import { SessionService } from "./session/SessionService.server";
import { OAuthProviderFactoryService } from "./session/OAuthProviderFactoryService.server";
import { MailService } from "./mail/MailService.server";
import { ClockService } from "./IClockService.server";
import { transport } from "./dependencies.server";
import { DEFAULT_MAIL_FROM } from "../constants.server";
import { LocalFileSystemService } from "./fs/LocalFileSystemService.server";
import type { DatabaseClient } from "../db/interfaces.server";

export const createServerContext = (db: DatabaseClient) =>
  buildServerContext<ServerContext>({
    clockService: new ClockService(),
    fileSystemService: new LocalFileSystemService("./.data"),
    loggerService: new LoggerService(),
    mailService: new MailService(transport, DEFAULT_MAIL_FROM),
    oauthProviderFactoryService: new OAuthProviderFactoryService(),
    sessionService: new SessionService(db),
    userService: new UserService(db),
  });
