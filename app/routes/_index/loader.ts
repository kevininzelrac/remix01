import { redirect, type LoaderFunctionArgs, json } from "@remix-run/node";

import { PAGES } from "~/constants";

export async function loader({ request, context }: LoaderFunctionArgs) {
  if (!context.sessionService.getAuthenticatedUserId(request)) {
    return redirect(PAGES.SIGN_IN);
  }
  return json({});
}
