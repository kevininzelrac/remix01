import { redirect } from "@remix-run/node";

import { PAGES } from "~/constants";
import { middleware } from "~/server/middleware";

export const loader = middleware.build(async () => {
  return redirect(PAGES.HOME);
});
