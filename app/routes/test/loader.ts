import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { serverContext } from "~/server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({
    data: await serverContext.userService.getByEmail("kevin@prisma.io"),
  });
};
