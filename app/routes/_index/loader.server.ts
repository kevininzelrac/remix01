import { middleware } from "~/server/middleware";

import { authGuard } from "~/server/permissions/authGuard.server";

// FIXME: Do the following:
// - Add tests for all things we are adding.
// - Add an authorization service (???)
export const loader = middleware.build(async (args) => {
  await authGuard(args);
  return {};
});
