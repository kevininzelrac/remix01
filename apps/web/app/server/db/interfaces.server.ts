import type { PrismaClient } from "@prisma/client";

export type * from "@prisma/client";

export type DatabaseClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$transaction" | "$extends" | "$on" | "$use"
>;
