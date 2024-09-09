import { PrismaClient } from "@prisma/client";
import { MigrationParams, UmzugStorage } from "umzug";
import type { CustomLogger } from "./logger.js";

type UmzugContext = {
  logger: CustomLogger;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IUmzugStorage extends UmzugStorage<UmzugContext> {}

export class CustomUmzugStorage implements IUmzugStorage {
  constructor(private client: PrismaClient) {}

  async logMigration(params: MigrationParams<UmzugContext>): Promise<void> {
    await this._ensureMigrationTable();
    const timestamp = new Date().toISOString();
    const { logs } = params.context.logger;
    await this.client.$executeRaw`
      INSERT INTO _umzug_migrations (
        migration_name,
        migration_path,
        performed_at,
        logs
      ) VALUES (
        ${params.name},
        ${params.path || ""},
        ${timestamp},
        ${logs}
      )
      ON CONFLICT (migration_name) DO UPDATE
      SET performed_at = ${timestamp},
          logs = ${logs},
          rolled_back_at = NULL
    `;
    params.context.logger.flush();
  }

  async unlogMigration(params: MigrationParams<UmzugContext>): Promise<void> {
    await this._ensureMigrationTable();
    const timestamp = new Date().toISOString();
    const { logs } = params.context.logger;
    await this.client.$executeRaw`
      UPDATE _umzug_migrations
      SET rolled_back_at = ${timestamp},
          rollback_logs = ${logs}
      WHERE migration_name = ${params.name}
    `;
    params.context.logger.flush();
  }

  async executed(): Promise<string[]> {
    await this._ensureMigrationTable();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows: any[] = await this.client.$queryRaw`
      SELECT *
      FROM _umzug_migrations
      WHERE rolled_back_at IS NULL
    `;
    return rows.map((item) => item.migration_name);
  }

  async _ensureMigrationTable(): Promise<void> {
    await this.client.$executeRaw`
      CREATE TABLE IF NOT EXISTS _umzug_migrations (
        id SERIAL,
        migration_name TEXT NOT NULL UNIQUE,
        migration_path TEXT NOT NULL,
        performed_at TIMESTAMPTZ NOT NULL,
        logs JSON NOT NULL,
        rolled_back_at TIMESTAMPTZ,
        rollback_logs JSON,
      )
    `;
  }
}
