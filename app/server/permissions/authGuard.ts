import { redirect } from "@remix-run/node";

import { PAGES, WIZARD_STEP } from "~/constants";
import type { ServerContext } from "../interfaces";

export const authGuard = async (args: {
  context: ServerContext;
  request: Request;
}) => {
  const { context, request } = args;

  const user = await context.sessionService.getAuthenticatedUser(request);
  if (!user) {
    // FIXME: REPLACE WITH STANDARD ERROR
    throw redirect(PAGES.SIGN_OUT);
  }

  if (user.wizardStep != WIZARD_STEP.COMPLETE) {
    // FIXME: REPLACE WITH STANDARD ERROR
    throw redirect(PAGES.WIZARD(user.wizardStep));
  }
};
