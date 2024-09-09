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
