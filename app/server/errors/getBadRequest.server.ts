import { ERROR_TYPES } from "~/constants";
import { getStandardError } from "./getStandardError.server";
import type { StandardError } from "./StandardError.server";

const STATUS = 400;
const STATUS_TEXT = "Bad request.";

export function getBadRequest(message: string): StandardError;
export function getBadRequest(messages: string[]): StandardError;
export function getBadRequest(messages: string | string[]): StandardError {
  if (typeof messages == "string") {
    messages = [messages];
  }

  return getStandardError(STATUS, STATUS_TEXT, {
    type: ERROR_TYPES.BAD_REQUEST,
    messages,
  });
}
