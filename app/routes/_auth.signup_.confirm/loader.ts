import { LoaderFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { newUserSession } from "~/services/session.server";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const newUser = await newUserSession.getSession(
    request.headers.get("Cookie")
  );
  const { email } = newUser.get("newUser");
  return json(email);
};
