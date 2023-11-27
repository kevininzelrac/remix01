import { PrismaClient } from "@prisma/client";

export const database = new PrismaClient();

export async function clearDatabase(): Promise<void> {
  await database.user.deleteMany();
}
