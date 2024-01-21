import { PrismaClient } from "@prisma/client";
import { readReplicas } from "@prisma/extension-read-replicas";

import type { ServerContext } from "~/server/interfaces";
import { buildServerContext } from "~/server/injection";
import { LoggerService } from "./LoggerService.server";
import { UserService } from "./UserService.server";
import { READ_DB_URL } from "../constants.server";
import { PostService } from "./PostService.server";
import { SessionService } from "./session/SessionService.server";

const prisma = new PrismaClient().$extends(
  readReplicas({
    url: READ_DB_URL,
  }),
) as any as PrismaClient;

export const serverContext = buildServerContext<ServerContext>({
  loggerService: new LoggerService(),
  userService: new UserService(prisma),
  postService: new PostService(prisma),
  sessionService: new SessionService(),
});
