import { redirect, type LoaderFunctionArgs, json } from "@remix-run/node";

import { PAGES } from "~/constants";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const userId = context.sessionService.getAuthenticatedUserId(request);
  if (!userId) {
    return redirect(PAGES.SIGN_IN);
  }

  const user = await context.userService.getById(userId);
  if (!user) {
    context.loggerService.error("Could not find user.", { userId });
    return redirect(PAGES.SIGN_IN);
  }

  return json({ user });
}
