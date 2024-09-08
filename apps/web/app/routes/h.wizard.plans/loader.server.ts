import { WizardStep } from "@app/utils/constants";

import { PAGES } from "~/constants/routes.js";
import { middleware } from "~/server/middleware/index.js";
import { authGuard } from "~/server/permissions/authGuard.server.js";
import { getFullUrlFromPath } from "~/server/utils/getFullUrlFromPath.js";

export const loader = middleware.build(async (args) => {
  await authGuard(args);

  const { container, request } = args;
  const productList = await container.productService.getProducts();

  return {
    products: productList,
    successUrl: getFullUrlFromPath(request, PAGES.WIZARD(WizardStep.COMPLETE)),
    cancelUrl: getFullUrlFromPath(request, PAGES.WIZARD(WizardStep.PLANS)),
  };
});
