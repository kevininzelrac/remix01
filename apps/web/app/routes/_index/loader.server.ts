import { redirect } from "@remix-run/node";
import { PAGES } from "../../constants/routes.js";
import { middleware } from "../../server/middleware/index.js";
import type { DataFunctionArgsWithContainer } from "../../server/middleware/defaults/provideServerContext.server.js";

import { authGuard } from "../../server/permissions/authGuard.server.js";

// TODO: We can split loaders and actions to properly test them
export const baseLoader = async (args: DataFunctionArgsWithContainer) => {
  await authGuard(args);
  return redirect(PAGES.SETUP);
};

export const loader = middleware.build(baseLoader);
