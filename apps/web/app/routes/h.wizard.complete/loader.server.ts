import { redirect } from "@remix-run/node";

import { PAGES } from "~/constants/routes.js";
import { middleware } from "~/server/middleware/index.js";

export const loader = middleware.build(async () => {
  return redirect(PAGES.HOME);
});
