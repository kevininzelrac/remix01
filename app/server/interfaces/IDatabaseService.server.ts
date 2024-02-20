import type { DatabaseClient } from "~/server/db/interfaces.server";

export interface IDatabaseService {
  getClient(): DatabaseClient;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}
