import { type LoaderFunctionArgs, json } from "@remix-run/node";

import { authGuard } from "~/server/middleware";
import { withMiddleware } from "~/server/middleware/utils";

// FIXME: Do the following:
// - Add tests for all things we are adding.
// - Add an authorization service (???)
// - Add vite+fastify support https://github.com/remix-run/remix/discussions/8180
// - Add server image optimization
export const loader = withMiddleware(
  [authGuard],
  ({ request, context }: LoaderFunctionArgs) => {
    return json({});
  },
);
