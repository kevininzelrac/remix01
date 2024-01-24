import { redirect } from "@remix-run/node";

import type { Middleware, RouteFunction } from "./utils";
import { PAGES, WIZARD_STEP } from "~/constants";

export const authGuard: Middleware<RouteFunction> = (f) => async (args) => {
  const { context, request } = args;

  const user = await context.sessionService.getAuthenticatedUser(request);
  if (!user) {
    return redirect(PAGES.SIGN_OUT);
  }

  if (user.wizardStep != WIZARD_STEP.COMPLETE) {
    return redirect(PAGES.WIZARD(user.wizardStep));
  }

  return f(args);
};
