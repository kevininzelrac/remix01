import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import "./styles/root.css";

export default function App() {
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
          <nav>
            <NavLink to="/" prefetch="intent">
              HOME
            </NavLink>
            <NavLink to="blog" prefetch="intent">
              BLOG
            </NavLink>
            <NavLink to="portfolio" prefetch="intent">
              PORTFOLIO
            </NavLink>
            <NavLink to="profil" prefetch="intent">
              PROFIL
            </NavLink>
          </nav>
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
