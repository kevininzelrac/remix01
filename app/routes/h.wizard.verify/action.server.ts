import { redirect, type ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";

import { PAGES, WizardStep } from "~/constants";
import { RESEND_CODE, SUBMIT_CODE } from "./constants";

const schema = z.union([
  z.object({
    type: z.literal(SUBMIT_CODE),
    code: z.string().trim(),
  }),
  z.object({
    type: z.literal(RESEND_CODE),
  }),
]);

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const rawData = Object.fromEntries(formData.entries());
  const result = schema.safeParse(rawData);
  if (!result.success) {
    throw new Error("Invalid action.");
  }

  const user = await context.sessionService.getAuthenticatedUser(request);
  if (!user) {
    return redirect(PAGES.SIGN_OUT);
  }

  const { data } = result;
  switch (data.type) {
    case SUBMIT_CODE:
      if (await context.sessionService.verifyEmail(user, data.code)) {
        await context.userService.updateUser(user.id, {
          wizardStep: WizardStep.PROFILE,
        });
        return redirect(PAGES.WIZARD(WizardStep.PROFILE));
      } else {
        throw new Error("Invalid code.");
      }
    case RESEND_CODE:
      await context.sessionService.sendVerificationEmail(user);
      return json({});
  }
};