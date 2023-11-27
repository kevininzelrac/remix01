import type { ServerContext } from "~/server/interfaces";
import { buildServerContext } from "~/server/injection";
import { LoggerService } from "./LoggerService.server";
import { UserService } from "./UserService.server";
import { PrismaClient } from "@prisma/client";
import { readReplicas } from "@prisma/extension-read-replicas";
import { READ_DB_URL } from "../constants.server";

const prisma = new PrismaClient().$extends(
  readReplicas({
    url: READ_DB_URL,
  }),
) as any as PrismaClient;

export const serverContext = buildServerContext<ServerContext>({
  loggerService: new LoggerService(),
  userService: new UserService(prisma),
});
