import { ClientError } from "./ClientError";
import { ClientErrorType, type ClientErrorData } from "./types";

export class PermissionDeniedError extends ClientError {
  private messages: string[];

  constructor(message?: string) {
    super(ClientErrorType.PERMISSION_DENIED);
    this.messages = [message ?? "You cannot perform this action."];
  }

  getData(): ClientErrorData {
    return {
      type: ClientErrorType.PERMISSION_DENIED,
      messages: this.messages,
    };
  }
}
