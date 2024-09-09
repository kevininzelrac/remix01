import { PrismaClient } from "@prisma/client";
import type { Logger } from "./logger.js";

export type MigrationParams = {
  name: string;
  path: string;
  context: {
    logger: Logger;
  };
};

export enum MigrationType {
  SQL = "sql",
  TYPESCRIPT = "ts",
}

export type Transaction = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$transaction" | "$extends" | "$on" | "$use"
>;
