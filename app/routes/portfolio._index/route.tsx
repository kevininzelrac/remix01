import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import ErrorBoundary from "~/components/errorBoundary";

export { ErrorBoundary };

export const meta: MetaFunction = () => {
  return [
    { title: "Expositions" },
    { name: "description", content: "Expositions" },
  ];
};

export default function Expositions() {
  return (
    <section>
      <h3>Expositions</h3>
      TODO...
    </section>
  );
}
