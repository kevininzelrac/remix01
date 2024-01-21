import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request, context }: LoaderFunctionArgs) {
  throw Error("");
}
