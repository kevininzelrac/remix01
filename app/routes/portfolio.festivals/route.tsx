import type { MetaFunction } from "@remix-run/node";

import ErrorBoundary from "~/components/errorBoundary";
import { loader } from "./loader";
import { useLoaderData } from "@remix-run/react";
export { ErrorBoundary, loader };

export const meta: MetaFunction = () => {
  return [{ title: "Home" }, { name: "description", content: "Home" }];
};

export default function Index() {
  const { data } = useLoaderData<typeof loader>();
  return (
    <section>
      <h3>Festivals</h3>
      TODO...
    </section>
  );
}
