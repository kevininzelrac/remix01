import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { auth } from "~/services/auth.server";
import { serverContext as prisma } from "~/server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { id, headers } = await auth(request);
  if (!id)
    return redirect("/signin", {
      headers,
    });

  const categories = await prisma.postService.getCategories();

  return json({ id, categories });
};
