import { PrismaClient } from "@prisma/client";

type Transaction = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$transaction" | "$extends" | "$on" | "$use"
>;

type Params = {
  client: Transaction;
  logger: {
    debug: (message: Record<string, unknown>) => void;
    info: (message: Record<string, unknown>) => void;
    warn: (message: Record<string, unknown>) => void;
    error: (message: Record<string, unknown>) => void;
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const up = async (params: Params): Promise<void> => {};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const down = async (params: Params): Promise<void> => {};
