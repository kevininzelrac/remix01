import type { HandledErrorBody } from "~/types";

export class StandardError<
  E extends HandledErrorBody = HandledErrorBody,
> extends Response {
  constructor(status: number, statusText: string, data: E, headers?: Headers) {
    if (status < 400) {
      throw new Error(
        `Status for a standard error should be >=400. Instead got ${status}.`,
      );
    }

    const body = JSON.stringify({ error: data });
    headers = headers ?? new Headers();
    headers.set("Content-Type", "application/json; charset=utf-8");

    super(body, {
      status,
      statusText,
      headers,
    });
  }
}
