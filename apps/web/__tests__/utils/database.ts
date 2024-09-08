import { DatabaseService } from "@app/services/db/DatabaseService";
import { PrismaClient } from "@app/db";

const database = new PrismaClient();
export const databaseService = new DatabaseService(database);
