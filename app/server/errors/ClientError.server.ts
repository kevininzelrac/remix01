import type { ClientErrorType } from "./ClientErrorType.server";
import type { ClientErrorData } from "./types";

export abstract class ClientError extends Error {
  constructor(private type: ClientErrorType) {
    super(type);
  }

  abstract getData(): ClientErrorData;
}
