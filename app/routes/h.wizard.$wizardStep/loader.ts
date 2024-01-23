import type { User } from "@prisma/client";
import { redirect, type LoaderFunctionArgs, json } from "@remix-run/node";

import { PAGES, WIZARD_STEP } from "~/constants";

type ProfileData = {
  step: typeof WIZARD_STEP.PROFILE;
  user: User;
};

type PlansData = {
  step: typeof WIZARD_STEP.PLANS;
};

type LoaderData = ProfileData | PlansData;

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

  if (user.wizardStep == WIZARD_STEP.COMPLETE) {
    return redirect(PAGES.HOME);
  }

  let data: LoaderData;
  switch (user.wizardStep) {
    case WIZARD_STEP.PROFILE:
      data = {
        step: user.wizardStep,
        user,
      };
      break;
    case WIZARD_STEP.PLANS:
      data = {
        step: user.wizardStep,
      };
      break;
    default:
      context.loggerService.error("Unexpected wizard step.", {
        step: user.wizardStep,
      });
      return redirect(PAGES.SIGN_OUT);
  }

  // FIXME: HANDLE WIZARD STEP
  return json(data);
}
