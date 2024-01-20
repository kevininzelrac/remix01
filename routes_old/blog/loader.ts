import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { defer } from "@remix-run/node";
import { auth } from "~/services/auth.server";

export const loader: LoaderFunction = async ({
  request,
  context,
}: LoaderFunctionArgs) => {
  const response = context.postService.getPosts();
  const { headers } = await auth(request);
  return defer({ response }, { headers });
};
