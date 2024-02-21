import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";

import { authGuard } from "~/server/permissions";

export const loader = async (args: LoaderFunctionArgs) => {
  await authGuard(args);

  const { context } = args;
  const productList = await context.productService.getProducts();

  return json({
    products: productList,
  });
};
