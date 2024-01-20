import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { auth } from "~/services/auth.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { id, headers } = await auth(request);
  if (!id)
    return redirect("/signin", {
      headers,
    });
  return json(
    {
      data: await context.userService.getByEmail("kevin@prisma.io"),
    },
    { headers },
  );
};
