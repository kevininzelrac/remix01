import { json } from "@remix-run/node";
import { WizardStep } from "~/constants";
import { middleware } from "~/server/middleware";
import { authGuard } from "~/server/permissions";

export const loader = middleware.build(async (args) => {
  const { user } = await authGuard(args);

  const { context } = args;
  await context.sessionService.sendVerificationEmail(user);

  return json({
    step: WizardStep.VERIFY,
  });
});
