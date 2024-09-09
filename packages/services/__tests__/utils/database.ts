import { PrismaClient } from "@app/db";

import { DatabaseService } from "../../src/db/DatabaseService.js";

const database = new PrismaClient();
export const databaseService = new DatabaseService(database);
