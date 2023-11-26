import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "react-router";

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  return json({ genre: params.genre! });
};

export default function Genre() {
  const { genre } = useLoaderData<typeof loader>();

  return (
    <section>
      <h3>
        <p>{genre}</p>
      </h3>
    </section>
  );
}
