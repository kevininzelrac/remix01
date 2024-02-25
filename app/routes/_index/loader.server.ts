import { json } from "@remix-run/node";
import { middleware } from "~/server/middleware";

import { authGuard } from "~/server/permissions";

// FIXME: Do the following:
// - Add tests for all things we are adding.
// - Add an authorization service (???)
// - Add vite+fastify support https://github.com/remix-run/remix/discussions/8180
export const loader = middleware.build(async (args) => {
  await authGuard(args);
  return json({});
});
