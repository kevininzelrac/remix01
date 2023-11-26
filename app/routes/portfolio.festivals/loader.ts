import { LoaderFunction, LoaderFunctionArgs, json } from "@remix-run/node";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  throw new Error("Oops, something went wrong !");
  return json({ data: "Festivals are so cool " });
};
