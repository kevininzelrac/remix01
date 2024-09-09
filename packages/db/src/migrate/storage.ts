import type { Client } from "pg";
import { MigrationParams } from "./types.js";

export class Storage {
  async logForwardMigration(
    client: Client,
    params: MigrationParams,
  ): Promise<void> {
    const timestamp = new Date().toISOString();
    const { logs } = params.context.logger;
    await client.query(
      `
      INSERT INTO _migration_log (
        migration_name,
        migration_path,
        applied_at,
        logs
      ) VALUES (
        $1,
        $2,
        $3,
        $4
      )
      ON CONFLICT (migration_name) DO UPDATE
      SET applied_at = $3,
          logs = $4,
          rolled_back_at = NULL
    `,
      [params.name, params.path || "", timestamp, logs, timestamp],
    );
    params.context.logger.flush();
  }

  async logRollbackMigration(
    client: Client,
    params: MigrationParams,
  ): Promise<void> {
    const timestamp = new Date().toISOString();
    const { logs } = params.context.logger;
    await client.query(
      `
      UPDATE _migration_log
      SET rolled_back_at = $1,
          rollback_logs = $2
      WHERE migration_name = $3
    `,
      [timestamp, logs, params.name],
    );
    params.context.logger.flush();
  }

  async getAppliedMigrations(client: Client): Promise<string[]> {
    const { rows } = await client.query(`
      SELECT *
      FROM _migration_log
      WHERE rolled_back_at IS NULL
    `);
    return rows.map((item) => item.migration_name);
  }

  async ensureMigrationTable(client: Client): Promise<void> {
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migration_log (
        id SERIAL,
        migration_name TEXT NOT NULL UNIQUE,
        migration_path TEXT NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL,
        logs JSON NOT NULL,
        rolled_back_at TIMESTAMPTZ,
        rollback_logs JSON
      )
    `);
  }
}
