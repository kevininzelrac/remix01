import { PrismaClient } from "@prisma/client";
import { readReplicas } from "@prisma/extension-read-replicas";

import { READ_DB_URL } from "~/server/constants.server";
import type { DatabaseClient } from "~/server/db/interfaces.server";
import type { IDatabaseService } from "~/server/interfaces/IDatabaseService.server";
import type { ServerContext } from "~/server/interfaces/ServerContext.server";

export class DatabaseService implements IDatabaseService {
  private _complete: boolean;
  private _transaction: DatabaseClient | null;
  private _waiter: Promise<void> | null;
  private _commit: (() => void) | null;
  private _rollback: (() => void) | null;

  constructor(private _prisma: PrismaClient) {
    this._transaction = null;
    this._complete = false;
    this._waiter = null;
    this._commit = null;
    this._rollback = null;
  }

  begin = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      this._waiter = this._prisma.$transaction(async (tx) => {
        this._transaction = tx;
        resolve();

        return new Promise((commit, rollback) => {
          this._commit = commit;
          this._rollback = rollback;
        });
      });

      this._waiter.catch(reject);
    });
  };

  transaction = (): DatabaseClient => {
    if (this._transaction === null) {
      throw Error("No transaction found");
    }
    return this._transaction;
  };

  commit = async (): Promise<void> => {
    if (this._complete) return;
    if (this._waiter === null || this._commit === null) {
      throw new Error("Commit occurs before transaction begins.");
    }
    this._commit();
    return this._waiter;
  };

  rollback = async (): Promise<void> => {
    if (this._complete) return;
    if (this._waiter === null || this._rollback === null) {
      throw new Error("Rollback occurs before transaction begins.");
    }
    this._rollback();
    return this._waiter.catch(() => {});
  };
}

const prisma = new PrismaClient().$extends(
  readReplicas({
    url: READ_DB_URL,
  }),
) as any as PrismaClient;

export const getDatabaseService = (context: ServerContext) => {
  return new DatabaseService(prisma);
};
