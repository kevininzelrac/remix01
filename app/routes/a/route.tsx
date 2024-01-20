import { Outlet } from "@remix-run/react";

import { loader } from "./loader";
export { loader };

export default function Auth() {
  return <Outlet />;
}
