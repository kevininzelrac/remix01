import type { ERROR_TYPES } from "../constants";

export type HandledErrorBody = {
  type: ERROR_TYPES;
  messages: string[];
};
