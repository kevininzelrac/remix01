import { LoaderFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { userSession } from "~/services/session.server";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const user = await userSession.getSession(request.headers.get("Cookie"));
  if (user.get("accessToken")) throw redirect("/");
  return null;
};
