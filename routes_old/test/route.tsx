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
  if (!data) {
    return (
      <section>
        <h3>User not found!</h3>
      </section>
    );
  }
  return (
    <section>
      <h3>{data.fullName}</h3>
    </section>
  );
}
