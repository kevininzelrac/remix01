import type { DatabaseClient } from "~/server/db/interfaces.server";

export interface IDatabaseService {
  begin(): Promise<void>;
  transaction(): DatabaseClient;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}
