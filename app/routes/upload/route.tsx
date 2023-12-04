/*****************************************************************/
/* THIS FEATURE WILL ONLY WORK ONCE DEPLOYED ON VERCEL PLATFORM */
/***************************************************************/

import { useFetcher } from "@remix-run/react";
import { loader } from "./loader";
import { action } from "./action";
export { loader, action };

export default function Upload() {
  const fetcher = useFetcher<typeof action>();

  return (
    <main>
      <h2>Upload</h2>
      <fetcher.Form method="post" encType="multipart/form-data">
        <input type="file" name="file" accept="image/*" />
        <button type="submit">Upload</button>
      </fetcher.Form>
      {fetcher.state !== "idle" ? fetcher.state : null}
      {fetcher.data ? <img src={fetcher.data.url} /> : null}
    </main>
  );
}
