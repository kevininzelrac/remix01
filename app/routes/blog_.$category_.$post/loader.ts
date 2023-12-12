import { LoaderFunctionArgs, json } from "@remix-run/node";
import { serverContext as prisma } from "~/server";
import { auth } from "~/services/auth.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { id, headers } = await auth(request);

  const post = await prisma.postService.getPost(
    params.category!,
    params.post?.replaceAll("_", " ")!
  );

  return json({ post, id }, { headers });
};
