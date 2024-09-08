import { WizardStep } from "@app/utils/constants";
import { redirect } from "@remix-run/node";

import { PAGES } from "~/constants/routes.js";
import { middleware } from "~/server/middleware/index.js";
import { authGuard } from "~/server/permissions/authGuard.server.js";

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
