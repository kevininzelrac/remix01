import { PAGES, WizardStep } from "~/constants";
import { middleware } from "~/server/middleware";

import { authGuard } from "~/server/permissions/authGuard.server";
import { getFullUrlFromPath } from "~/server/utils";

export const loader = middleware.build(async (args) => {
  await authGuard(args);

  const { context, request } = args;
  const productList = await context.productService.getProducts();

  return {
    products: productList,
    successUrl: getFullUrlFromPath(request, PAGES.WIZARD(WizardStep.COMPLETE)),
    cancelUrl: getFullUrlFromPath(request, PAGES.WIZARD(WizardStep.PLANS)),
  };
});
