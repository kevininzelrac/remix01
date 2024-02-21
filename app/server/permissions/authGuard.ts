import { PAGES, WizardStep } from "~/constants";
import type { ServerContext } from "../interfaces";
import { RedirectError } from "../errors";

export const authGuard = async (args: {
  context: ServerContext;
  request: Request;
}) => {
  const { context, request } = args;

  const user = await context.sessionService.getAuthenticatedUser(request);
  if (!user) {
    throw new RedirectError(PAGES.SIGN_OUT);
  }

  const url = new URL(request.url);
  if (
    user.wizardStep != WizardStep.COMPLETE &&
    url.pathname !== PAGES.WIZARD(user.wizardStep as WizardStep)
  ) {
    throw new RedirectError(PAGES.WIZARD(user.wizardStep as WizardStep));
  }

  return { user };
};
