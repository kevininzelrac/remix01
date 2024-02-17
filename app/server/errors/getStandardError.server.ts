import { json } from "@remix-run/node";
import type { HandledErrorBody } from "~/types";
import type { StandardError } from "./StandardError.server";

export function getStandardError(
  status: number,
  statusText: string,
  error: HandledErrorBody,
): StandardError {
  return json(
    {
      error,
    },
    {
      status,
      statusText,
    },
  );
}
