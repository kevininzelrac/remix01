import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { WizardStep } from "~/constants";
import { authGuard } from "~/server/permissions";

export const loader = async (args: LoaderFunctionArgs) => {
  const { user } = await authGuard(args);

  const { context } = args;
  await context.sessionService.sendVerificationEmail(user);

  return json({
    step: WizardStep.VERIFY,
  });
};
