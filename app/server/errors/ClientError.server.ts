import type { AsEnum } from "../types";
import type { ClientErrorType } from "./ClientErrorType.server";
import type { ClientErrorData } from "./types";

export abstract class ClientError extends Error {
  constructor(private type: AsEnum<typeof ClientErrorType>) {
    super(type);
  }

  abstract getData(): ClientErrorData;
}
