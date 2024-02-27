import { WizardStep } from "@app/utils/constants";
import { middleware } from "~/server/middleware";
import { authGuard } from "~/server/permissions/authGuard.server";

export const loader = middleware.build(async (args) => {
  const { user } = await authGuard(args);

  const { container } = args;
  await container.sessionService.sendVerificationEmail(user);

  return {
    step: WizardStep.VERIFY,
  };
});
