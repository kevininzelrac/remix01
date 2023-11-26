import type { MetaFunction } from "@remix-run/node";
import { NavLink, Outlet } from "@remix-run/react";

import ErrorBoundary from "~/components/errorBoundary";
export { ErrorBoundary };

export const meta: MetaFunction = () => {
  return [{ title: "Music" }, { name: "description", content: "Music" }];
};

export default function Music() {
  return (
    <main>
      <h2>Music</h2>
      Choose a genre :
      <nav>
        <NavLink to="Rock" prefetch="intent">
          Rock
        </NavLink>
        <NavLink to="blues" prefetch="intent">
          Blues
        </NavLink>
        <NavLink to="jazz" prefetch="intent">
          Jazz
        </NavLink>
        <NavLink to="salsa" prefetch="intent">
          Salsa
        </NavLink>
      </nav>
      <Outlet />
    </main>
  );
}
