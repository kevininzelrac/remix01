/**
 * Inspired by https://github.com/prisma/prisma/issues/4688#issuecomment-1498670192
 */
import { PrismaClient } from "@prisma/client";
import { Command } from "commander";
import { Umzug } from "umzug";
import { confirm } from "@inquirer/prompts";

enum MigrationType {
  SQL = "sql",
  TYPESCRIPT = "ts",
}

const client = new PrismaClient();
const umzug = new Umzug({
  migrations: { glob: "schema/migrationss/**/*.sql" },
  logger: console,
});

const program = new Command();
program
  .name("migrate")
  .description("Perform database migrations powered by Umzug");

const migrationTypeList = Object.values(MigrationType);
program
  .command("create")
  .description("Create a new migration")
  .argument("<name>", "name of migration to create")
  .option(
    "--type <type>",
    `Type of migration. Valid choices: ${migrationTypeList.join(", ")}. Default: ${MigrationType.SQL}`,
    MigrationType.SQL,
  )
  .action(async (name: string, opts: { type: MigrationType }) => {
    // FIXME: THIS NEEDS WORK TO BE COMPATIBLE WITH PRISMA
    if (opts.type === MigrationType.TYPESCRIPT) {
      await umzug.create({
        name: name,
        folder: "schema/migrationss",
        allowExtension: ".ts",
      });
    }
  });

program
  .command("up")
  .description("Execute pending migrations")
  .option(
    "--to",
    "Name of migration to execute up to. If not supplied, runs all migrations.",
  )
  .action(async (opts: { to?: string }) => {
    await umzug.up(opts);
  });

program
  .command("down")
  .description("Revert executed migrations")
  .option(
    "--to",
    "Name of migration to revert to. If not supplied reverts all migrations.",
  )
  .action(async (opts: { to?: string }) => {
    if (
      opts.to === undefined &&
      !confirm({
        message: "Do you wish to revert all migrations?",
        default: false,
      })
    ) {
      return;
    }
    await umzug.down({
      to: opts.to ?? 0,
    });
  });

program
  .command("status")
  .description("Get migrations status")
  .action(async () => {
    const pendingMigrations = await umzug.pending();
    if (pendingMigrations.length === 0) {
      return;
    }
    program.error(
      `Found pending migrations, execute \`migrate up\` to run them.\n${JSON.stringify(
        pendingMigrations.map((mig) => mig.name),
      )}`,
      {
        exitCode: 1,
        code: "pending.migrations",
      },
    );
  });

const go = async () => {
  try {
    await program.parseAsync();
  } finally {
    await client.$disconnect();
  }
};

void go();
