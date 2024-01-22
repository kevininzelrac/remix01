import { redirect, type LoaderFunctionArgs, json } from "@remix-run/node";

import { pages } from "~/constants";

export async function loader({ request, context }: LoaderFunctionArgs) {
  if (!context.sessionService.verifyCredentials(request)) {
    return redirect(pages.SIGN_IN);
  }
  return json({});
}
