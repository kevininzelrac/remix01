import { middleware } from "~/server/middleware";
import type { DataFunctionArgsWithContainer } from "~/server/middleware/defaults/provideServerContext";

import { authGuard } from "~/server/permissions/authGuard.server";

// FIXME: Do the following:
// - Add tests for all things we are adding.
// - Add an authorization service (???)
// - Add an admin interface using refine.dev

// FIXME: We can split loaders and actions to properly test them
export const baseLoader = async (args: DataFunctionArgsWithContainer) => {
  await authGuard(args);
  return {};
};

export const loader = middleware.build(baseLoader);
