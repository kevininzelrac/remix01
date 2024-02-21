import { ERROR_TYPES } from "~/constants";
import { StandardError } from "./StandardError.server";

const STATUS = 302;
const STATUS_TEXT = "Redirect.";

export class RedirectError extends StandardError {
  constructor(location: string) {
    const headers = new Headers();
    headers.set("Location", location);

    super(
      STATUS,
      STATUS_TEXT,
      {
        type: ERROR_TYPES.REDIRECT,
        messages: [],
      },
      headers,
    );
  }
}
