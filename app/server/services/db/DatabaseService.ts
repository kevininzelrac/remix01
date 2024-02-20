import type { PrismaClient } from "@prisma/client/extension";
import type { DatabaseClient } from "~/server/db/interfaces.server";
import type { IDatabaseService, ServerContext } from "~/server/interfaces";

export class DatabaseService implements IDatabaseService {
  constructor(private prisma: PrismaClient) {}

  getClient(): DatabaseClient {
    throw new Error("Method not implemented.");
  }

  commit(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  rollback(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export const getDatabaseService = (context: ServerContext) => {
  return new DatabaseService
};
