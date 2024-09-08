import { DatabaseService } from "@app/services/db/DatabaseService";
import { PrismaClient } from "@app/db";

export const database = new PrismaClient();
export const databaseService = new DatabaseService(database);

export async function clearDatabase(): Promise<void> {
  await database.user.deleteMany();
}
