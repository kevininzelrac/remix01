import type { ClientErrorData } from "./types";

export abstract class ClientError extends Error {
  constructor(private type: string) {
    super(type);
  }

  abstract getData(): ClientErrorData;
}
