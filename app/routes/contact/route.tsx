import type { MetaFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";

import ErrorBoundary from "~/components/errorBoundary";
export { ErrorBoundary };

export const meta: MetaFunction = () => {
  return [{ title: "Home" }, { name: "description", content: "Home" }];
};

import { action } from "./action";
export { action };

export default function Contact() {
  const fetcher = useFetcher<typeof action>();
  let isSubmitting = fetcher.state === "submitting";
  let isLoading = fetcher.state === "loading";
  let isIdle = fetcher.state === "idle";

  const id = "001";

  return (
    <main>
      <h2>Contact</h2>
      TODO...
      <fetcher.Form method="post">
        <input type="hidden" name="id" value={id} />
        <input type="text" name="name" placeholder="enter name here" />
        <button type="submit">Submit</button>
      </fetcher.Form>
      <section>
        {isSubmitting ? "submitting" : isLoading ? "loading" : null}
        {fetcher.data ? (
          <>
            <h3>{fetcher.data.id}</h3>
            <p>{fetcher.data.name}</p>
          </>
        ) : null}
      </section>
    </main>
  );
}
