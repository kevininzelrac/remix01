import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import mime from "mime-types";

import { PAGES, WizardStep } from "~/constants";

const schema = z.object({
  fullName: z.string().trim(),
  avatar: z.instanceof(Blob),
});

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
  const avatarExtension = mime.extension(data.avatar.type);
  const avatarPath = `/avatars/${user.id}.${avatarExtension}`;
  const avatarBinaryData = await data.avatar.arrayBuffer();
  await context.fileSystemService.saveFile(avatarPath, avatarBinaryData);
  await context.userService.updateUser(user.id, {
    fullName: data.fullName,
    wizardStep: WizardStep.PLANS,
  });

  return redirect(PAGES.WIZARD(WizardStep.PLANS));
};
