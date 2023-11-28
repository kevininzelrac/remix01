import { LoaderFunction, LoaderFunctionArgs, defer } from "@remix-run/node";
import { auth } from "~/services/auth.server";
import { serverContext as prisma } from "~/server";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const response = prisma.postService.getPosts();
  const { headers } = await auth(request);
  return defer({ response }, { headers });
};
