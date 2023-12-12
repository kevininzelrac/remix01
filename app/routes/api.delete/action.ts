import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { serverContext as prisma } from "~/server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const type = formData.get("type") as string;

  await prisma.postService.deletePost(formData.get("id") as string);

  if (type === "post") return redirect("/blog");
  return redirect("/");
};
