import {
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import { useState } from "react";

import ReadOnly from "~/components/slate/readOnly";
import Dialog from "~/components/dialog";

import type { MetaFunction } from "@remix-run/node";
export const meta: MetaFunction = ({ params }) => {
  const post = params.post?.replaceAll("_", " ");
  return [{ title: post }, { name: "description", content: post }];
};

import { loader } from "./loader";
import ErrorBoundary from "~/components/errorBoundary";
export { loader, ErrorBoundary };

export default function Index() {
  const { id, post } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const path = pathname.replace("/Edit", "");
  const [display, setDisplay] = useState(false);

  const Confirm = () => {
    const handleDelete = () => {
      fetcher.submit(
        { id: post!.id, type: post!.type },
        { method: "POST", action: "/api/delete" }
      );
      localStorage.removeItem("slate" + path);
    };
    return <button onClick={handleDelete}>confirm Delete</button>;
  };
  return (
    <main>
      {display ? (
        <Dialog handleClose={() => setDisplay(false)}>
          <Confirm />
        </Dialog>
      ) : null}
      <section className="slate">
        <h2>{post!.title}</h2>
        {id === post!.authorId ? (
          <>
            <button onClick={() => navigate("Edit")}>Edit</button>
            <button onClick={() => setDisplay(true)}>Delete</button>
          </>
        ) : null}
        <ReadOnly>{post?.content}</ReadOnly>
      </section>
    </main>
  );
}
