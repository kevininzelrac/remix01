import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";

//export const config = { runtime: "edge" };

import { auth } from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { id, headers } = await auth(request);
  if (!id)
    return redirect("/signin", {
      headers,
    });
  return json(null, { headers });
};
