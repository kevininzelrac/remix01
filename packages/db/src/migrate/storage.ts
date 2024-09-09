import { MigrationParams, Transaction } from "./types.js";

export class Storage {
  async logForwardMigration(
    tx: Transaction,
    params: MigrationParams,
  ): Promise<void> {
    await this._ensureMigrationTable(tx);
    const timestamp = new Date().toISOString();
    const { logs } = params.context.logger;
    await tx.$executeRaw`
      INSERT INTO _umzug_migrations (
        migration_name,
        migration_path,
        applied_at,
        logs
      ) VALUES (
        ${params.name},
        ${params.path || ""},
        ${timestamp},
        ${logs}
      )
      ON CONFLICT (migration_name) DO UPDATE
      SET applied_at = ${timestamp},
          logs = ${logs},
          rolled_back_at = NULL
    `;
    params.context.logger.flush();
  }

  async logRollbackMigration(
    tx: Transaction,
    params: MigrationParams,
  ): Promise<void> {
    await this._ensureMigrationTable(tx);
    const timestamp = new Date().toISOString();
    const { logs } = params.context.logger;
    await tx.$executeRaw`
      UPDATE _umzug_migrations
      SET rolled_back_at = ${timestamp},
          rollback_logs = ${logs}
      WHERE migration_name = ${params.name}
    `;
    params.context.logger.flush();
  }

  async getAppliedMigrations(tx: Transaction): Promise<string[]> {
    await this._ensureMigrationTable(tx);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows: any[] = await tx.$queryRaw`
      SELECT *
      FROM _umzug_migrations
      WHERE rolled_back_at IS NULL
    `;
    return rows.map((item) => item.migration_name);
  }

  private async _ensureMigrationTable(tx: Transaction): Promise<void> {
    await tx.$executeRaw`
      CREATE TABLE IF NOT EXISTS _umzug_migrations (
        id SERIAL,
        migration_name TEXT NOT NULL UNIQUE,
        migration_path TEXT NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL,
        logs JSON NOT NULL,
        rolled_back_at TIMESTAMPTZ,
        rollback_logs JSON,
      )
    `;
  }
}
