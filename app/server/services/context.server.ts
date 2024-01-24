import { PrismaClient } from "@prisma/client";
import { readReplicas } from "@prisma/extension-read-replicas";

import type { ServerContext } from "~/server/interfaces";
import { buildServerContext } from "~/server/injection";
import { LoggerService } from "./LoggerService.server";
import { UserService } from "./UserService.server";
import { READ_DB_URL } from "../constants.server";
import { SessionService } from "./session/SessionService.server";
import { OAuthProviderFactoryService } from "./session/OAuthProviderFactoryService.server";
import { MailService } from "./MailService.server";
import { ClockService } from "./IClockService.server";

const prisma = new PrismaClient().$extends(
  readReplicas({
    url: READ_DB_URL,
  }),
) as any as PrismaClient;

export const serverContext = buildServerContext<ServerContext>({
  clockService: new ClockService(),
  loggerService: new LoggerService(),
  mailService: new MailService(),
  oauthProviderFactoryService: new OAuthProviderFactoryService(),
  sessionService: new SessionService(prisma),
  userService: new UserService(prisma),
});
