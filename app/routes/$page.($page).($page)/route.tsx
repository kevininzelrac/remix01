import {
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

import { loader } from "./loader";
export { loader };

import ReadOnly from "~/components/slate/readOnly";
import { useState } from "react";
import Dialog from "~/components/dialog";

export const meta: MetaFunction = () => [
  { title: "Home" },
  { name: "description", content: "Home" },
];

export default function Index() {
  const { id, data } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const path = pathname.replace("/Edit", "");
  const [display, setDisplay] = useState(false);

  const Confirm = () => {
    const handleDelete = () => {
      fetcher.submit(
        { id: data.id, type: data.type },
        { method: "POST", action: "/api/delete" }
      );
      localStorage.removeItem("slate" + path);
    };
    return <button onClick={handleDelete}>confirm Delete</button>;
  };
  return (
    <main key={data.title}>
      {display ? (
        <Dialog handleClose={() => setDisplay(false)}>
          <Confirm />
        </Dialog>
      ) : null}
      <section className="slate">
        {id === data.authorId ? (
          <>
            <button onClick={() => navigate("Edit")}>Edit</button>
            <button onClick={() => setDisplay(true)}>Delete</button>
          </>
        ) : null}
        <ReadOnly>{data?.content}</ReadOnly>
      </section>
    </main>
  );
}
