import { useFetcher, useLoaderData, useLocation } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

import { loader } from "./loader";
import { action } from "./action";
import ErrorBoundary from "~/components/errorBoundary";
export { loader, action, ErrorBoundary };

import Editor from "~/components/slate/editor";
import ClientOnly from "~/utils/clientOnly";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [{ title: "Home" }, { name: "description", content: "Home" }];
};

export default function Index() {
  const { id, categories } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const { pathname } = useLocation();
  const path = pathname.replace("/Edit", "");
  const [type, setType] = useState("page");
  const [title, setTitle] = useState("");
  const [category, setParent] = useState("");

  const handleSave = async () => {
    fetcher.submit(
      {
        authorId: id,
        type,
        title,
        category,
        content: localStorage.getItem("slate" + path),
      },
      { method: "POST" }
    );
    localStorage.removeItem("slate" + path);
    return true;
  };

  return (
    <main>
      <section className="slate">
        <input
          type="text"
          name="title"
          placeholder="title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="page">page</option>
          <option value="post">post</option>
          <option value="category">category</option>
        </select>
        {/*  */}
        <select value={category} onChange={(e) => setParent(e.target.value)}>
          <option value="post">post</option>
          <option value="page">page</option>
          {categories
            //?.filter((category) => category.type === type)
            ?.map(({ title }) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
        </select>
        <ClientOnly>
          <Editor handleSave={handleSave}>insert text here</Editor>
        </ClientOnly>
      </section>
    </main>
  );
}
