import { ActionFunction, ActionFunctionArgs, json } from "@remix-run/node";
import { put } from "@vercel/blob";

export const config = { runtime: "edge" };

export let action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const file = form.get("file") as File;
  const { url } = await put(file.name, file, { access: "public" });

  return json({ url });
};
