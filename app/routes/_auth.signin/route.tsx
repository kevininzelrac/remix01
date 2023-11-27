import { useFetcher } from "@remix-run/react";

import { action } from "./action";
export { action };

export default function Signin() {
  const fetcher = useFetcher<typeof action>();
  let isIdle = fetcher.state === "idle";
  let isSumitting = fetcher.state === "submitting";
  let isLoading = fetcher.state === "loading";

  return (
    <section>
      <h3>Signin</h3>
      <fetcher.Form method="post">
        <input type="email" name="email" placeholder="email" />
        <input type="password" name="password" placeholder="password" />
        <button type="submit">submit</button>
      </fetcher.Form>
      {!isIdle ? <span>{fetcher.state}</span> : null}

      {fetcher.data?.error ? (
        <span style={{ color: "red" }}>{fetcher.data.error}</span>
      ) : null}
    </section>
  );
}
