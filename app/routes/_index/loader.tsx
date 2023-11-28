import { LoaderFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { auth } from "~/services/auth.server";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const { id, email, firstname, avatar, headers } = await auth(request);
  return json({ id, email, firstname, avatar }, { headers });
};
