import {
  ActionFunction,
  ActionFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const id = formData.get("id");
  const name = formData.get("name");
  if (!name) throw redirect("/");
  await new Promise<void>((resolve) => setTimeout(resolve, 500));
  return json({ id, name });
};
