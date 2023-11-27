import { LoaderFunction, json } from "@remix-run/node";
import { auth } from "~/services/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const { firstname, email, avatar } = await auth(request);

  return json({ firstname, email, avatar });
};
