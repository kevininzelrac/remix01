import { PrismaClient } from "@prisma/client";
import { readReplicas } from "@prisma/extension-read-replicas";

import { READ_DB_URL } from "../constants.server";

export const prisma = new PrismaClient().$extends(
  readReplicas({
    url: READ_DB_URL,
  }),
) as any as PrismaClient;
