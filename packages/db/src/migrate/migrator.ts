import { UTCDate } from "@date-fns/utc";
import { exec, spawn } from "child_process";
import { cp, mkdir, readFile, readdir, rm, stat } from "fs/promises";
import { dirname, relative, resolve } from "path";
import pg from "pg";
import { fileURLToPath } from "url";

import { Storage } from "./storage.js";
import { MigrationType } from "./types.js";
import { Logger } from "./logger.js";

type Params = {
  client: pg.Client;
  logger: {
    debug: (message: Record<string, unknown>) => void;
    info: (message: Record<string, unknown>) => void;
    warn: (message: Record<string, unknown>) => void;
    error: (message: Record<string, unknown>) => void;
  };
};

export const client = new pg.Client({
  connectionString: process.env.WRITE_DB_URL,
});
const storage = new Storage();
const logger = new Logger();

const SCHEMA_PATH = "./schema";
const MIGRATIONS_DEV = "./.migrate/dev";
const MIGRATIONS_DIFF_FROM = "./.migrate/diff/from";
const MIGRATIONS_DIFF_TO = "./.migrate/diff/to";
const SNAKE_CASE_PATTERN = /^(?!.*__)[a-z0-9]+(_[a-z0-9]+)*$/;

export const up = async (name?: string): Promise<void> => {
  await storage.ensureMigrationTable(client);

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
  await storage.ensureMigrationTable(client);

  const migrationStatuses = await _getAllMigrationStatuses();
  if (name !== undefined) {
    _validateMigrationName(migrationStatuses, name);
  }

  // Prepare migration diff folders
  await _preparePrismaLikeFolder(MIGRATIONS_DIFF_FROM);
  await _preparePrismaLikeFolder(MIGRATIONS_DIFF_TO);

  for (const migrationStatus of migrationStatuses.reverse()) {
    await rm(`${MIGRATIONS_DIFF_TO}/migrations/${migrationStatus.name}`, {
      force: true,
    });
    if (name !== undefined && migrationStatus.name === name) {
      return;
    }
    if (migrationStatus.applied) {
      await _rollbackMigration(migrationStatus.name);
    }
    await rm(`${MIGRATIONS_DIFF_FROM}/migrations/${migrationStatus.name}`, {
      force: true,
    });
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
      await _preparePrismaLikeFolder(MIGRATIONS_DEV);
      /* Create migration files using prisma */
      await new Promise<void>((resolve, reject) => {
        const child = spawn(
          "./node_modules/.bin/prisma",
          [
            "migrate",
            "dev",
            "--create-only",
            `--name="${name}"`,
            `--schema="${MIGRATIONS_DEV}/schema.prisma"`,
          ],
          {
            stdio: "inherit",
            shell: true,
          },
        );

        child.on("exit", (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`Process exited with code ${code}`));
          }
        });

        child.on("error", (error) => {
          reject(new Error(`Failed to start process: ${error.message}`));
        });
      });
      const filesToCopy: string[] = await new Promise((resolve, reject) => {
        exec(
          `find ${MIGRATIONS_DEV}/migrations -type f \\( -name '*.sql' \\)`,
          (err, stdout) => {
            if (err) {
              reject(err);
            } else {
              resolve(stdout.split("\n").filter((item) => !!item));
            }
          },
        );
      });
      for (const file of filesToCopy) {
        const target = file.replace(MIGRATIONS_DEV, SCHEMA_PATH);
        if (await _fileExists(target)) {
          continue;
        }
        await cp(file, target);
      }
      return;
    }

    case MigrationType.TYPESCRIPT: {
      const timestamp = new UTCDate();
      const sortkey = [
        timestamp.getFullYear().toString().padStart(4, "0"),
        (timestamp.getMonth() + 1).toString().padStart(2, "0"),
        timestamp.getDate().toString().padStart(2, "0"),
        timestamp.getHours().toString().padStart(2, "0"),
        timestamp.getMinutes().toString().padStart(2, "0"),
        timestamp.getSeconds().toString().padStart(2, "0"),
      ].join("");
      const path = `${SCHEMA_PATH}/migrations/${sortkey}_${name}`;
      await mkdir(path, { recursive: true });
      return cp("./src/migrate/template.ts", `${path}/migration.ts`);
    }

    default: {
      throw new Error(`Unknown migration type ${type}.`);
    }
  }
};

export const pending = async (): Promise<string[]> => {
  await storage.ensureMigrationTable(client);

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
  const allMigrations = (await readdir(`${SCHEMA_PATH}/migrations`)).sort();
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
  const migrationFiles = await readdir(`${SCHEMA_PATH}/migrations/${name}`);

  if (migrationFiles.includes("migration.sql")) {
    const path = `${SCHEMA_PATH}/migrations/${name}/migration.sql`;
    const contents = await readFile(path, "utf-8");
    return _useTransaction(async (tx) => {
      await tx.query(contents);
      await storage.logForwardMigration(tx, {
        name,
        path,
        context: { logger },
      });
    });
  }

  if (migrationFiles.includes("migration.ts")) {
    const path = `${SCHEMA_PATH}/migrations/${name}/migration.ts`;
    const up: (params: Params) => Promise<void> = (
      await _importTypescriptMigration(path)
    ).up;
    return _useTransaction(async (tx) => {
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
  const migrationFiles = await readdir(`${SCHEMA_PATH}/migrations/${name}`);

  if (migrationFiles.includes("migration.sql")) {
    const path = `${SCHEMA_PATH}/migrations/${name}/migration.ts`;
    const hasPrevious =
      (await readdir(`${MIGRATIONS_DIFF_TO}/migrations`)).length > 0;
    const contents: string = await new Promise((resolve, reject) => {
      exec(
        [
          "./node_modules/.bin/prisma",
          "migrate",
          "diff",
          `--shadow-database-url="${process.env.WRITE_DB_URL}"`,
          `--from-migrations="${MIGRATIONS_DIFF_FROM}/migrations"`,
          hasPrevious
            ? `--to-migrations="${MIGRATIONS_DIFF_TO}/migrations"`
            : "--to-empty",
          "--script",
        ].join(" "),
        (err, stdout) => {
          if (err) {
            reject(err);
          } else {
            resolve(stdout);
          }
        },
      );
    });
    return _useTransaction(async (tx) => {
      await tx.query(contents);
      await storage.logRollbackMigration(client, {
        name,
        path,
        context: { logger },
      });
    });
  }

  if (migrationFiles.includes("migration.ts")) {
    const path = `${SCHEMA_PATH}/migrations/${name}/migration.ts`;
    const down: (params: Params) => Promise<void> = (
      await _importTypescriptMigration(path)
    ).down;
    return _useTransaction(async (tx) => {
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

const _preparePrismaLikeFolder = async (folderName: string): Promise<void> => {
  await rm(folderName, { recursive: true, force: true });
  const filesToCopy: string[] = await new Promise((resolve, reject) => {
    exec(
      `find ${SCHEMA_PATH} -type f \\( -name '*.sql' -or -name 'schema.prisma' -or -name '*.toml' \\)`,
      (err, stdout) => {
        if (err) {
          reject(err);
        } else {
          resolve(stdout.split("\n").filter((item) => !!item));
        }
      },
    );
  });
  for (const file of filesToCopy) {
    const path = dirname(file);
    await mkdir(path, { recursive: true });
    await cp(file, file.replace(SCHEMA_PATH, folderName));
  }
};

const _fileExists = async (filename: string): Promise<boolean> => {
  try {
    await stat(filename);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return false;
    }
    throw err;
  }
};

const _useTransaction = async (
  callback: (tx: pg.Client) => Promise<void>,
): Promise<void> => {
  try {
    await client.query("BEGIN");
    await callback(client);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
};

const _importTypescriptMigration = (
  filepath: string,
): Promise<{
  up: (params: Params) => Promise<void>;
  down: (params: Params) => Promise<void>;
}> => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const absolutePath = resolve(filepath);
  const importPath = relative(__dirname, absolutePath);
  return import(importPath);
};
