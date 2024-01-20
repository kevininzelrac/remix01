import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { userSession } from "~/services/session.server";
import { auth } from "~/services/auth.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const user = await userSession.getSession(request.headers.get("Cookie"));
  const { id, headers } = await auth(request);

  if (!id)
    return redirect("/signin", {
      headers,
    });

  await context.userService.revokeRefreshToken(id, user.get("refreshToken"));

  return redirect("/", {
    headers: {
      "Set-Cookie": await userSession.destroySession(user),
    },
  });
};
