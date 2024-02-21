import { redirect } from "@remix-run/node";

import { PAGES } from "~/constants";

export const loader = async () => {
  return redirect(PAGES.HOME);
};
