import { ClientError } from "./ClientError";
import { ClientErrorType, type ClientErrorData } from "./types";

export class NotAuthenticatedError extends ClientError {
  private messages: string[];

  constructor(message: string) {
    super(ClientErrorType.NOT_AUTHENTICATED);
    this.messages = [message];
  }

  getData(): ClientErrorData {
    return {
      type: ClientErrorType.NOT_AUTHENTICATED,
      messages: this.messages,
    };
  }
}
