import { redirect } from "@remix-run/node";
import { z } from "zod";
import mime from "mime-types";

import { PAGES, WizardStep } from "~/constants";
import { middleware } from "~/server/middleware";
import { authGuard } from "~/server/permissions/authGuard.server";

const schema = z.object({
  fullName: z.string().trim(),
  avatar: z.instanceof(Blob),
});

export const action = middleware.build(async (args) => {
  const { request, container } = args;
  const formData = await request.formData();
  const rawData = Object.fromEntries(formData.entries());
  const result = schema.safeParse(rawData);
  if (!result.success) {
    throw new Error("Invalid action.");
  }

  const { user } = await authGuard(args);

  const { data } = result;
  const avatarExtension = mime.extension(data.avatar.type);
  const avatarPath = `/avatars/${user.id}.${avatarExtension}`;
  const avatarBinaryData = await data.avatar.arrayBuffer();
  await container.fileSystemService.saveFile(avatarPath, avatarBinaryData);
  await container.userService.updateUser(user.id, {
    fullName: data.fullName,
    wizardStep: WizardStep.PLANS,
  });

  return redirect(PAGES.WIZARD(WizardStep.PLANS));
});
