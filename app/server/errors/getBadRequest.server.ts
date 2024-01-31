import { ERROR_TYPES } from "~/constants";
import { getStandardError } from "./getStandardError.server";

const STATUS = 400;
const STATUS_TEXT = "Bad request.";

export function getBadRequest(message: string): Response;
export function getBadRequest(messages: string[]): Response;
export function getBadRequest(messages: string | string[]): Response {
  if (typeof messages == "string") {
    messages = [messages];
  }

  return getStandardError(STATUS, STATUS_TEXT, {
    type: ERROR_TYPES.BAD_REQUEST,
    messages,
  });
}
