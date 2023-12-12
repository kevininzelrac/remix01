import { ActionFunctionArgs, json } from "@remix-run/node";
import { serverContext as prisma } from "~/server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const post = await prisma.postService.createPost({
    authorId: formData.get("authorId") as string,
    type: formData.get("type") as string,
    title: formData.get("title") as string,
    category: formData.get("category") as string,
    content: formData.get("content") as string,
  });

  return json({ post });
};
