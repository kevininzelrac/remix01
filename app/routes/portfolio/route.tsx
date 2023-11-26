import type { MetaFunction } from "@remix-run/node";
import { NavLink, Outlet } from "@remix-run/react";

import ErrorBoundary from "~/components/errorBoundary";
export { ErrorBoundary };

export const meta: MetaFunction = () => {
  return [
    { title: "Portfolio" },
    { name: "description", content: "Portfolio" },
  ];
};

export default function Portfolio() {
  return (
    <main>
      <h2>Portfolio</h2>
      <nav>
        <NavLink to="" prefetch="intent" end>
          Expositions
        </NavLink>
        <NavLink to="festivals" prefetch="intent">
          Festivals
        </NavLink>
      </nav>
      <Outlet />
    </main>
  );
}
