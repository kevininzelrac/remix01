import { redirect } from "@remix-run/node";
import { PAGES, WizardStep } from "~/constants";
import { middleware } from "~/server/middleware";
import { authGuard } from "~/server/permissions/authGuard.server";

export const loader = middleware.build(async (args) => {
  const { user } = await authGuard(args);

  const nextStep = user.emailVerifiedAt
    ? WizardStep.PROFILE
    : WizardStep.VERIFY;

  const { container } = args;
  await container.userService.updateUser(user.id, {
    wizardStep: nextStep,
  });

  return redirect(PAGES.WIZARD(nextStep));
});
