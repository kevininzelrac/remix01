import { DatabaseClient, PrismaClient, getClient } from "@app/db";
import { AssertionError } from "@app/utils/errors/AssertionError";

import type { IDatabaseService } from "~/types/IDatabaseService";

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
      throw new AssertionError("Commit occurs before transaction begins.");
    }
    this._commit();
    return this._waiter;
  };

  rollback = async (): Promise<void> => {
    if (this._complete) return;
    if (this._waiter === null || this._rollback === null) {
      throw new AssertionError("Rollback occurs before transaction begins.");
    }
    this._rollback();
    return this._waiter.catch(() => {});
  };
}

export type DatabaseServiceOptions = {
  readDbUrl: string;
};

export const getDatabaseService = ({ readDbUrl }: DatabaseServiceOptions) => {
  const prisma = getClient(readDbUrl);
  return () => {
    return new DatabaseService(prisma);
  };
};
