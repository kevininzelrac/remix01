import { z } from "zod";
import { middleware } from "~/server/middleware";
import { ActionType } from "./constants";
import { BadRequestError } from "@app/utils/errors/BadRequestError";
import { BASE_URL } from "~/server/constants.server";
import { PAGES } from "~/constants";
import { redirect } from "@remix-run/node";

const schema = z.union([
  z.object({
    type: z.literal(ActionType.SUBMIT_EMAIL),
    email: z.string().email().toLowerCase(),
  }),
  z.object({
    type: z.literal(ActionType.RESET_PASSWORD),
    code: z.string(),
    password: z.string(),
    verifyPassword: z.string(),
  }),
]);

export const action = middleware.build(async ({ request, container }) => {
  const formData = await request.formData();
  const rawData = Object.fromEntries(formData.entries());
  const result = schema.safeParse(rawData);
  if (!result.success) {
    throw new BadRequestError("Invalid action.");
  }

  const { data } = result;
  switch (data.type) {
    case ActionType.SUBMIT_EMAIL: {
      const url = new URL(PAGES.FORGOT_PASSWORD, BASE_URL);
      await container.sessionService.sendForgotPasswordEmail(data.email, url);
      return {};
    }
    case ActionType.RESET_PASSWORD: {
      const { code, password, verifyPassword } = data;
      if (password !== verifyPassword) {
        throw new BadRequestError("Passwords do not match.");
      }
      await container.sessionService.resetPassword(code, password);
      return redirect(PAGES.SIGN_IN);
    }
  }
});
