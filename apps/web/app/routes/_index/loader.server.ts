import { redirect } from "@remix-run/node";
import { PAGES } from "~/constants";
import { middleware } from "~/server/middleware";
import type { DataFunctionArgsWithContainer } from "~/server/middleware/defaults/provideServerContext.server";

import { authGuard } from "~/server/permissions/authGuard.server";

// TODO: We can split loaders and actions to properly test them
export const baseLoader = async (args: DataFunctionArgsWithContainer) => {
  await authGuard(args);
  return redirect(PAGES.SETUP);
};

export const loader = middleware.build(baseLoader);
