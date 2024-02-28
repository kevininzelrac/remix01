import type { ServerContext } from "@app/services/types/ServerContext";
import { WizardStep } from "@app/utils/constants";
import { redirect } from "@remix-run/node";

import { PAGES } from "~/constants";

export const authGuard = async (args: {
  container: ServerContext;
  request: Request;
}) => {
  const { container, request } = args;

  const user = await container.sessionService.getAuthenticatedUser(request);
  if (!user) {
    throw redirect(PAGES.SIGN_OUT);
  }

  const url = new URL(request.url);
  if (
    user.wizardStep != WizardStep.COMPLETE &&
    url.pathname !== PAGES.WIZARD(user.wizardStep as WizardStep)
  ) {
    throw redirect(PAGES.WIZARD(user.wizardStep as WizardStep));
  }

  return { user };
};
