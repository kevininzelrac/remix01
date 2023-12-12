import { LoaderFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { auth } from "~/services/auth.server";
import { serverContext as prisma } from "~/server";

export const loader: LoaderFunction = async ({
  params,
  request,
}: LoaderFunctionArgs) => {
  const { id, headers } = await auth(request);

  const data = await prisma.postService.getPage(
    params.page!.replaceAll("_", " ")
  );

  return json({ data, id }, { headers });
};
