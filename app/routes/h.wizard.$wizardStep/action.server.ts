import { redirect, type ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import mime from "mime-types";

import { PAGES, WIZARD_STEP } from "~/constants";
import { withMiddleware } from "~/server/middleware/utils";
import { RESEND_CODE, SUBMIT_CODE, UPDATE_PROFILE } from "./constants";

const schema = z.union([
  z.object({
    type: z.literal(SUBMIT_CODE),
    code: z.string().trim(),
  }),
  z.object({
    type: z.literal(RESEND_CODE),
  }),
  z.object({
    type: z.literal(UPDATE_PROFILE),
    fullName: z.string().trim(),
    avatar: z.instanceof(Blob),
  }),
]);

export const action = withMiddleware(
  [],
  async ({ request, context }: ActionFunctionArgs) => {
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
          context.userService.updateUser(user.id, {
            wizardStep: WIZARD_STEP.PROFILE,
          });
          return redirect(PAGES.WIZARD(WIZARD_STEP.PROFILE));
        } else {
          throw new Error("Invalid code.");
        }
      case RESEND_CODE:
        await context.sessionService.sendVerificationEmail(user);
        return json({});
      case UPDATE_PROFILE:
        const avatarExtension = mime.extension(data.avatar.type);
        const avatarPath = `/avatars/${user.id}.${avatarExtension}`;
        const avatarBinaryData = await data.avatar.arrayBuffer();
        await context.fileSystemService.saveFile(avatarPath, avatarBinaryData);
        await context.userService.updateUser(user.id, {
          fullName: data.fullName,
          wizardStep: WIZARD_STEP.PLANS,
        });
        return redirect(PAGES.WIZARD(WIZARD_STEP.PLANS));
    }
  },
);
