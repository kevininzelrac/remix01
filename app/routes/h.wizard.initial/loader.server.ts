import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { PAGES, WizardStep } from "~/constants";
import { authGuard } from "~/server/permissions";

export const loader = async (args: LoaderFunctionArgs) => {
  const { user } = await authGuard(args);

  const nextStep = user.emailVerifiedAt
    ? WizardStep.PROFILE
    : WizardStep.VERIFY;

  const { context } = args;
  await context.userService.updateUser(user.id, {
    wizardStep: nextStep,
  });

  return redirect(PAGES.WIZARD(nextStep));
};
