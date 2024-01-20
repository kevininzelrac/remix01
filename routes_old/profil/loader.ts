import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { auth } from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { firstname, email, avatar, headers } = await auth(request);
  if (!firstname)
    return redirect("/signin", {
      headers,
    });
  return json({ firstname, email, avatar }, { headers });
};
