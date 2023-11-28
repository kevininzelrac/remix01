import { NavLink, Outlet } from "@remix-run/react";

import { loader } from "./loader";
export { loader };

export default function Auth() {
  return (
    <main>
      <h2>Auth</h2>
      <nav>
        <NavLink to="signin">Sign In</NavLink>
        <NavLink to="signup">Sign Up</NavLink>
      </nav>
      <Outlet />
    </main>
  );
}
