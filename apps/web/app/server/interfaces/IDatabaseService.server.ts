import type { DatabaseClient } from "@app/db";

export interface IDatabaseService {
  begin(): Promise<void>;
  transaction(): DatabaseClient;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}
