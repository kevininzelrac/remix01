import type { ERROR_TYPES } from "./constants";

export type HandledError = { error: HandledErrorBody };

export type HandledErrorBody = {
  type: typeof ERROR_TYPES.BAD_REQUEST;
  messages: string[];
};
