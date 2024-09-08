import { WizardStep } from "@app/utils/constants";
import { middleware } from "~/server/middleware/index.js";
import { authGuard } from "~/server/permissions/authGuard.server.js";

export const loader = middleware.build(async (args) => {
  const { user } = await authGuard(args);

  const { container } = args;
  await container.sessionService.sendVerificationEmail(user);

  return {
    step: WizardStep.VERIFY,
  };
});
