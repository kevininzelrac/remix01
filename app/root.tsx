import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import "./styles/root.css";
import "./styles/nav.css";
import "./styles/dialog.css";
import "./styles/slate.css";

import { LoaderFunctionArgs, json } from "@remix-run/node";
import { auth } from "./services/auth.server";
import Nav from "./components/nav";

import { serverContext as prisma } from "./server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { id, headers } = await auth(request);

  const nav = await prisma.postService.getNav();

  return json({ id, nav }, { headers });
};

export default function App() {
  const { id, nav } = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <h1>Remix v.01</h1>
        </header>
        <nav>
          <NavLink to="/" prefetch="intent">
            HOME
          </NavLink>
          <Nav data={nav} id={id ? true : false} />
          <NavLink to="blog" prefetch="intent">
            BLOG
          </NavLink>
          <NavLink to="contact" prefetch="intent">
            CONTACT
          </NavLink>
          {id ? (
            <>
              <NavLink to="upload" prefetch="intent">
                UPLOAD
              </NavLink>
              <NavLink to="profil" prefetch="intent">
                PROFIL
              </NavLink>
              <NavLink to="add" prefetch="intent">
                +
              </NavLink>
            </>
          ) : (
            <NavLink to="signin" prefetch="intent">
              SIGN IN
            </NavLink>
          )}
        </nav>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
