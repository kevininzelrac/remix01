import { type LoaderFunctionArgs, json } from "@remix-run/node";

import { authGuard } from "~/server/middleware";
import { withMiddleware } from "~/server/middleware/utils";

// FIXME: Do the following:
// - Add a forgot password view
// - Add a plans page with available plans
// - Add better error handling (with custom errors)
// - Add tests for all things we are adding.
// - Add an authorization service (???)
export const loader = withMiddleware(
  [authGuard],
  ({ request, context }: LoaderFunctionArgs) => {
    return json({});
  },
);
