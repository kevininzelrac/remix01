import type { ServerContext } from "~/server/interfaces";
import { buildServerContext } from "~/server/injection";
import { LoggerService } from "./LoggerService.server";
import { UserService } from "./UserService.server";
import { SessionService } from "./session/SessionService.server";
import { OAuthProviderFactoryService } from "./session/OAuthProviderFactoryService.server";
import { MailService } from "./mail/MailService.server";
import { ClockService } from "./IClockService.server";
import { prisma, transport } from "./dependencies.server";
import { DEFAULT_MAIL_FROM } from "../constants.server";
import { LocalFileSystemService } from "./fs/LocalFileSystemService.server";

export const serverContext = buildServerContext<ServerContext>({
  clockService: new ClockService(),
  fileSystemService: new LocalFileSystemService("./.data"),
  loggerService: new LoggerService(),
  mailService: new MailService(transport, DEFAULT_MAIL_FROM),
  oauthProviderFactoryService: new OAuthProviderFactoryService(),
  sessionService: new SessionService(prisma),
  userService: new UserService(prisma),
});
