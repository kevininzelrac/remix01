import { LoaderFunction, LoaderFunctionArgs, defer } from "@remix-run/node";
import { auth } from "~/services/auth.server";
import { serverContext as prisma } from "~/server";

export const loader: LoaderFunction = async ({
  request,
  params,
}: LoaderFunctionArgs) => {
  const response = prisma.postService.getPostsByCategory(params.category!);
  const { headers } = await auth(request);
  return defer({ response }, { headers });
};
