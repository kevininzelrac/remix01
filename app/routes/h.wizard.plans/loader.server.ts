import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { PAGES, WizardStep } from "~/constants";

import { authGuard } from "~/server/permissions";
import { getFullUrlFromPath } from "~/server/utils";

export const loader = async (args: LoaderFunctionArgs) => {
  await authGuard(args);

  const { context, request } = args;
  const productList = await context.productService.getProducts();

  return json({
    products: productList,
    successUrl: getFullUrlFromPath(request, PAGES.WIZARD(WizardStep.COMPLETE)),
    cancelUrl: getFullUrlFromPath(request, PAGES.WIZARD(WizardStep.PLANS)),
  });
};
