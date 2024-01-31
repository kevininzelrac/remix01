import { json } from "@remix-run/node";
import type { HandledErrorBody } from "~/types";

export function getStandardError(
  status: number,
  statusText: string,
  error: HandledErrorBody,
): Response {
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
