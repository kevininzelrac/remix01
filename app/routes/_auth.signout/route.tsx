import { ActionFunction, ActionFunctionArgs, redirect } from "@remix-run/node";
import { userSession } from "~/services/session.server";
import { serverContext as prisma } from "~/server";
import { auth } from "~/services/auth.server";
export const loader: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const user = await userSession.getSession(request.headers.get("Cookie"));
  const { id } = await auth(request);
  //console.log(id, user.get("refreshToken"));

  await prisma.userService.revokeRefreshToken(id, user.get("refreshToken"));

  return redirect("/", {
    headers: {
      "Set-Cookie": await userSession.destroySession(user),
    },
  });
};
