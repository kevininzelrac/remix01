import { LoaderFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { auth } from "~/services/auth.server";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const { headers } = await auth(request);
  return json({ data: "Festivals are so cool " }, { headers });
};
