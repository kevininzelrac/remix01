import type { MetaFunction } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";

import ErrorElement from "~/components/errorElement";
import { postType } from "./posts";

import { loader } from "./loader";
export { loader };

export const meta: MetaFunction = () => {
  return [{ title: "Blog" }, { name: "description", content: "Blog" }];
};

export default function Blog() {
  const { response } = useLoaderData<typeof loader>();
  return (
    <main>
      <h2>Blog</h2>
      <Suspense fallback={<div>Loading</div>}>
        <Await resolve={response} errorElement={<ErrorElement />}>
          {({ posts }) => (
            <section>
              {posts.map(({ title, content }: postType) => (
                <article key={title}>
                  <h3>{title}</h3>
                  <p>{content}</p>
                </article>
              ))}
            </section>
          )}
        </Await>
      </Suspense>
    </main>
  );
}
