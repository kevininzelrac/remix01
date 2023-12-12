import {
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

import { loader } from "./loader";
import { action } from "./action";
import ErrorBoundary from "~/components/errorBoundary";
export { loader, action, ErrorBoundary };

import Editor from "~/components/slate/editor";
import ClientOnly from "~/utils/clientOnly";
import ReadOnly from "~/components/slate/readOnly";
import Dialog from "~/components/dialog";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [{ title: "Home" }, { name: "description", content: "Home" }];
};

export default function Index() {
  const { id, page, categories } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const path = pathname.replace("/Edit", "");
  const [display, setDisplay] = useState(false);
  const [type, setType] = useState(page!.type);
  const [category, setParent] = useState(page!.category);

  const handleSave = async () => {
    fetcher.submit(
      {
        id: page!.id,
        type: type,
        category: category,
        content: localStorage.getItem("slate" + path),
      },
      { method: "POST" }
    );
    localStorage.removeItem("slate" + path);
    return true;
  };

  const Confirm = () => {
    const handleDelete = () => {
      fetcher.submit(
        { id: page!.id, type: page!.type },
        { method: "POST", action: "/api/delete" }
      );
      localStorage.removeItem("slate" + path);
    };
    return <button onClick={handleDelete}>confirm Delete</button>;
  };

  return (
    <main>
      <h2>{page?.title}</h2>
      {display ? (
        <Dialog handleClose={() => setDisplay(false)}>
          <Confirm />
        </Dialog>
      ) : null}
      <ClientOnly>
        <section className="slate">
          {id === page!.authorId ? (
            <>
              <button
                onClick={() => navigate(path)}
                style={{ color: "crimson" }}
              >
                Exit
              </button>
              <button onClick={() => setDisplay(true)}>Delete</button>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="page">page</option>
                <option value="post">post</option>
                <option value="category">category</option>
              </select>
              <select
                value={category}
                onChange={(e) => setParent(e.target.value)}
              >
                <option value="post">post</option>
                <option value="page">page</option>
                {categories?.map(({ title }) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
              <Editor handleSave={handleSave}>{page?.content}</Editor>
            </>
          ) : (
            <ReadOnly>{page?.content}</ReadOnly>
          )}
        </section>
      </ClientOnly>
    </main>
  );
}
