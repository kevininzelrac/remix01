import { PAGES, WizardStep } from "~/constants";
import type { ServerContext } from "../interfaces/ServerContext.server";
import { redirect } from "@remix-run/node";

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
