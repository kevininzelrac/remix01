import { redirect, type LoaderFunctionArgs, json } from "@remix-run/node";

import { PAGES, WIZARD_STEP } from "~/constants";

// FIXME: Do the following:
// - Add a verify email step (before auth token is generated)
// - Add a plans page with available plans
// - Add better error handling (with custom errors)
// - Add tests for all things we are adding.
// - Add an authorization service
// - Generalize this logic into some sort of auth guard.
export async function loader({ request, context }: LoaderFunctionArgs) {
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

  return json({});
}
