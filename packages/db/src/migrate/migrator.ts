import { PrismaClient } from "@prisma/client";
import { mkdir, readFile, readdir, writeFile } from "fs/promises";
import { exec } from "child_process";

import { Storage } from "./storage.js";
import { MigrationType, Transaction } from "./types.js";
import { Logger } from "./logger.js";

type Params = {
  client: Transaction;
  logger: {
    debug: (message: Record<string, unknown>) => void;
    info: (message: Record<string, unknown>) => void;
    warn: (message: Record<string, unknown>) => void;
    error: (message: Record<string, unknown>) => void;
  };
};

const client = new PrismaClient();
const storage = new Storage();
const logger = new Logger();

const MIGRATIONS_PATH = "./schema/migrations";
const SNAKE_CASE_PATTERN = /^(?!.*__)[a-z0-9]+(_[a-z0-9]+)*$/;

export const up = async (name?: string): Promise<void> => {
  const migrationStatuses = await _getAllMigrationStatuses();
  if (name !== undefined) {
    _validateMigrationName(migrationStatuses, name);
  }

  for (const migrationStatus of migrationStatuses) {
    if (!migrationStatus.applied) {
      await _applyMigration(migrationStatus.name);
    }
    if (name !== undefined && migrationStatus.name === name) {
      return;
    }
  }
};

export const down = async (name?: string): Promise<void> => {
  const migrationStatuses = await _getAllMigrationStatuses();
  if (name !== undefined) {
    _validateMigrationName(migrationStatuses, name);
  }

  for (const migrationStatus of migrationStatuses.reverse()) {
    if (name !== undefined && migrationStatus.name === name) {
      return;
    }
    if (migrationStatus.applied) {
      await _rollbackMigration(migrationStatus.name);
    }
  }
};

export const create = async (
  type: MigrationType,
  name: string,
): Promise<void> => {
  if (!SNAKE_CASE_PATTERN.test(name)) {
    throw new Error(`Migration name should be snake case. Provided: ${name}`);
  }

  switch (type) {
    case MigrationType.SQL: {
      return new Promise((resolve, reject) => {
        exec(
          `./node_modules/.bin/prisma migrate dev --create-only --name ${name}`,
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          },
        );
      });
    }
    case MigrationType.TYPESCRIPT: {
      const timestamp = new Date();
      const sortkey = [
        timestamp.getFullYear().toString().padStart(4, "0"),
        (timestamp.getMonth() + 1).toString().padStart(2, "0"),
        timestamp.getDate().toString().padStart(2, "0"),
        timestamp.getHours().toString().padStart(2, "0"),
        timestamp.getMinutes().toString().padStart(2, "0"),
        timestamp.getSeconds().toString().padStart(2, "0"),
      ].join("");
      const path = `${MIGRATIONS_PATH}/${sortkey}_${name}`;
      await mkdir(path, { recursive: true });
      return writeFile(
        `${path}/migration.ts`,
        await readFile("./src/migrate/template.ts", "utf-8"),
      );
    }
    default: {
      throw new Error(`Unknown migration type ${type}.`);
    }
  }
};

export const pending = async (): Promise<string[]> => {
  const migrationStatuses = await _getAllMigrationStatuses();
  return migrationStatuses
    .filter((item) => !item.applied)
    .map((item) => item.name);
};

type MigrationStatus = {
  name: string;
  applied: boolean;
};

const _getAllMigrationStatuses = async (): Promise<MigrationStatus[]> => {
  const allMigrations = (await readdir("./schema/migrations")).sort();
  const executedMigrations = new Set(
    await storage.getAppliedMigrations(client),
  );
  return allMigrations.map((name) => ({
    name,
    applied: executedMigrations.has(name),
  }));
};

const _validateMigrationName = (
  migrationStatuses: MigrationStatus[],
  name: string,
): void => {
  if (!migrationStatuses.map((item) => item.name).includes(name)) {
    throw new Error(`Migration not found. Provided: ${name}.`);
  }
};

const _applyMigration = async (name: string): Promise<void> => {
  const migrationFiles = await readdir(`${MIGRATIONS_PATH}/${name}`);

  if (migrationFiles.includes("migration.sql")) {
    const path = `${MIGRATIONS_PATH}/${name}/migration.sql`;
    const contents = await readFile(path, "utf-8");
    return client.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(contents);
      await storage.logForwardMigration(tx, {
        name,
        path,
        context: { logger },
      });
    });
  }

  if (migrationFiles.includes("migration.ts")) {
    const path = `${MIGRATIONS_PATH}/${name}/migration.ts`;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const up: (params: Params) => Promise<void> = require(path).up;
    return client.$transaction(async (tx) => {
      await up({ client: tx, logger });
      await storage.logForwardMigration(tx, {
        name,
        path,
        context: { logger },
      });
    });
  }

  throw new Error(`Could not find migration file for migration ${name}.`);
};

const _rollbackMigration = async (name: string): Promise<void> => {
  const migrationFiles = await readdir(`${MIGRATIONS_PATH}/${name}`);

  if (migrationFiles.includes("migration.sql")) {
    // FIXME: NOT IMPLEMENTED YET
  }

  if (migrationFiles.includes("migration.ts")) {
    const path = `${MIGRATIONS_PATH}/${name}/migration.ts`;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const down: (params: Params) => Promise<void> = require(path).up;
    return client.$transaction(async (tx) => {
      await down({ client: tx, logger });
      await storage.logRollbackMigration(tx, {
        name,
        path,
        context: { logger },
      });
    });
  }

  throw new Error(`Could not find migration file for migration ${name}.`);
};
