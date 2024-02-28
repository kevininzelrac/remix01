import { ClientError } from "./ClientError";
import { ClientErrorType, type ClientErrorData } from "./types";

export class ProductError extends ClientError {
  private messages: string[];

  constructor(message: string) {
    super(ClientErrorType.PRODUCT_ERROR);
    this.messages = [message];
  }

  getData(): ClientErrorData {
    return {
      type: ClientErrorType.PRODUCT_ERROR,
      messages: this.messages,
    };
  }
}
