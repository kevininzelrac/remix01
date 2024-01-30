import type { LoaderFunctionArgs } from "@remix-run/node";
import { withMiddleware } from "~/server/middleware/utils";

export const loader = withMiddleware([], ({ context }: LoaderFunctionArgs) => {
  return context.sessionService.handleSignOut();
});
