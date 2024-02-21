import type { ERROR_TYPES } from "../constants";

export type HandledError = { error: HandledErrorBody };

export type HandledErrorBody = {
  type: ERROR_TYPES;
  messages: string[];
};
