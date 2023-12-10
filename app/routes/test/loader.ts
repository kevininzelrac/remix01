import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { serverContext } from "~/server";
import { auth } from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { id, headers } = await auth(request);
  if (!id)
    return redirect("/signin", {
      headers,
    });
  return json(
    {
      data: await serverContext.userService.getByEmail("kevin@prisma.io"),
    },
    { headers }
  );
};
