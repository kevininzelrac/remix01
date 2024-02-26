import { redirect } from "@remix-run/node";
import { z } from "zod";
import { BadRequestError } from "~/server/errors/BadRequestError.server";
import { middleware } from "~/server/middleware";
import { authGuard } from "~/server/permissions/authGuard.server";

const schema = z.object({
  productId: z.string(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export const action = middleware.build(async (args) => {
  const { context, request } = args;
  const formData = await request.formData();
  const rawData = Object.fromEntries(formData.entries());
  const result = schema.safeParse(rawData);
  if (!result.success) {
    throw new BadRequestError("Invalid action.");
  }

  const { data } = result;
  const { user } = await authGuard(args);
  const redirectUrl = await context.productService.getProductCheckoutPage(
    user.id,
    data.productId,
    data.successUrl,
    data.cancelUrl,
  );

  return redirect(redirectUrl);
});
