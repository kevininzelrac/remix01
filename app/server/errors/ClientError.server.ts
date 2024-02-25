import type { ClientErrorData, ClientErrorType } from "./types";

export abstract class ClientError extends Error {
  constructor(private type: ClientErrorType) {
    super(type);
  }

  abstract getData(): ClientErrorData;
}
