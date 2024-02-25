import { ClientError } from "./ClientError.server";
import { ClientErrorType, type ClientErrorData } from "./types";

export class BadRequestError extends ClientError {
  private messages: string[];

  constructor(message: string);
  constructor(messages: string[]);
  constructor(messages: string | string[]) {
    super(ClientErrorType.BAD_REQUEST);
    if (Array.isArray(messages)) {
      this.messages = messages;
    } else {
      this.messages = [messages];
    }
  }

  getData(): ClientErrorData {
    return {
      type: ClientErrorType.BAD_REQUEST,
      messages: this.messages,
    };
  }
}
