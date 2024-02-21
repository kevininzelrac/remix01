import { redirect, json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";

import { PAGES, WizardStep } from "~/constants";
import type { TypedResponseData } from "~/server/types";

export const loader = async (args: LoaderFunctionArgs) => {
  const { request, context } = args;

  const userId = context.sessionService.getAuthenticatedUserId(request);
  if (!userId) {
    return redirect(PAGES.SIGN_IN);
  }

  const user = await context.userService.getById(userId);
  if (!user) {
    context.loggerService.error("Could not find user.", { userId });
    return redirect(PAGES.SIGN_OUT);
  }

  switch (user.wizardStep) {
    case WizardStep.PLANS:
      return handlePlans();
  }
};

const handlePlans = () => {
  return json({
    step: WizardStep.PLANS,
  });
};
export type PlansProps = TypedResponseData<ReturnType<typeof handlePlans>>;
