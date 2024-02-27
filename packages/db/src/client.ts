import { PrismaClient } from "@prisma/client";
import { readReplicas } from "@prisma/extension-read-replicas";

export const getClient = (readDbUrl: string): PrismaClient =>
  new PrismaClient().$extends(
    readReplicas({
      url: readDbUrl,
    }),
  ) as unknown as PrismaClient;
