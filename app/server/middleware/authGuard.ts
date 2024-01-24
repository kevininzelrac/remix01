import { redirect } from "@remix-run/node";

import type { Middleware } from "./utils";
import { PAGES, WIZARD_STEP } from "~/constants";

export const authGuard: Middleware = (f) => async (args) => {
  const { context, request } = args;

  const userId = context.sessionService.getAuthenticatedUserId(request);
  if (!userId) {
    return redirect(PAGES.SIGN_IN);
  }

  const user = await context.userService.getById(userId);
  if (!user) {
    context.loggerService.error("Could not find user.", { userId });
    return redirect(PAGES.SIGN_OUT);
  }

  if (user.wizardStep != WIZARD_STEP.COMPLETE) {
    return redirect(PAGES.WIZARD(user.wizardStep));
  }

  return f(args);
};
