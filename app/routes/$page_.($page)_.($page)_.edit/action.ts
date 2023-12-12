import { ActionFunctionArgs, json } from "@remix-run/node";
import { serverContext as prisma } from "~/server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  return json({
    post: await prisma.postService.updatePost(
      formData.get("id") as string,
      formData.get("type") as string,
      formData.get("category") as string,
      formData.get("content") as string
    ),
  });
};
