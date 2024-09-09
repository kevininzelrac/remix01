/**
 * Inspired by https://github.com/prisma/prisma/issues/4688#issuecomment-1498670192
 */
import { Command } from "commander";
import { confirm } from "@inquirer/prompts";
import { client, create, down, pending, up } from "./migrator.js";
import { MigrationType } from "./types.js";

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
  .action((name: string, opts: { type: string }) => {
    const type = opts.type;
    if (!isMigrationType(type)) {
      throw new Error(`Invalid migration type. Provided: ${type}.`);
    }
    return create(type, name);
  });

program
  .command("up")
  .description("Execute pending migrations")
  .option(
    "--to",
    "Name of migration to execute up to. If not supplied, runs all migrations.",
  )
  .action((opts: { to?: string }) => up(opts.to));

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
      (await !confirm({
        message: "Do you wish to revert all migrations?",
        default: false,
      }))
    ) {
      return;
    }
    await down(opts.to);
  });

program
  .command("status")
  .description("Get migrations status")
  .action(async () => {
    const pendingMigrations = await pending();
    if (pendingMigrations.length === 0) {
      return;
    }
    program.error(
      `Found pending migrations, execute \`migrate up\` to run them.\n${JSON.stringify(
        pendingMigrations,
      )}`,
      {
        exitCode: 1,
        code: "pending.migrations",
      },
    );
  });

function isMigrationType(type: string): type is MigrationType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Object.values(MigrationType).includes(type as any);
}

try {
  await client.connect();
  await program.parseAsync();
} finally {
  await client.end();
}
