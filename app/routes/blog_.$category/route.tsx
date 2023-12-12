import type { MetaFunction } from "@remix-run/node";
import {
  Await,
  NavLink,
  useAsyncValue,
  useLoaderData,
  useParams,
} from "@remix-run/react";
import { Suspense } from "react";

import ErrorElement from "~/components/errorElement";
import { loader } from "./loader";
import Badge from "~/components/badge";
export { loader };

export const meta: MetaFunction = () => {
  return [{ title: "Blog" }, { name: "description", content: "Blog" }];
};
import "./blog.css";
import { Post } from "@prisma/client";
import ReadOnly from "~/components/slate/readOnly";

export default function Blog() {
  const { response } = useLoaderData<typeof loader>();
  const { category } = useParams();
  return (
    <main>
      <h2>Category : {category}</h2>
      <Suspense fallback={<div>Loading</div>}>
        <Await resolve={response} errorElement={<ErrorElement />}>
          <Section />
        </Await>
      </Suspense>
    </main>
  );
}

const Section = () => {
  const posts = useAsyncValue() as Post[];
  return (
    <section>
      {posts.map(({ id, title, category, content, author }: any) => (
        <article key={id}>
          <header>
            <NavLink to={title.replaceAll(" ", "_")}>{title}</NavLink>
            <br />
            category : {category} <NavLink to="Edit">edit</NavLink>
            <Badge profil={author} />
          </header>
          <ReadOnly>{content}</ReadOnly>
        </article>
      ))}
    </section>
  );
};

//  OR YOU CAN DO THIS
//   <Suspense fallback={<div>Loading</div>}>
//   <Await resolve={response} errorElement={<ErrorElement />}>
//     {({ data: { getPosts } }) => (
//       <section>
//         {getPosts.map(({ title, content, profil }: any) => (
//           <article key={title}>
//             <header>
//               <h3>{title}</h3>
//               <img src={profil.avatar} width={30} height={30} />
//               <strong>{profil.firstname}</strong>
//             </header>
//             <p>{content}</p>
//           </article>
//         ))}
//       </section>
//     )}
//   </Await>
// </Suspense>;
