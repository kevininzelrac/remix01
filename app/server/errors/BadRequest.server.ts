import { ERROR_TYPES } from "~/constants";
import { StandardError } from "./StandardError.server";

const STATUS = 400;
const STATUS_TEXT = "Bad request.";

export class BadRequestError extends StandardError {
  constructor(message: string);
  constructor(messages: string[]);
  constructor(messages: string | string[]) {
    super(STATUS, STATUS_TEXT, {
      type: ERROR_TYPES.BAD_REQUEST,
      messages: Array.isArray(messages) ? messages : [messages],
    });
  }
}
