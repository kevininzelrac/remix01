import { Link } from "@remix-run/react";

import { Button } from "~/components/button";
import { PAGES } from "~/constants";

export function OAuthMenu() {
  return (
    <div className="flex space-x-4 justify-center">
      <Link to={PAGES.AUTH_LOGIN_API("google")}>
        <Button className="!bg-[#4285F4] text-white">Google</Button>
      </Link>
      <Link to={PAGES.AUTH_LOGIN_API("github")}>
        <Button className="!bg-[#333] text-white">GitHub</Button>
      </Link>
      <Link to={PAGES.AUTH_LOGIN_API("facebook")}>
        <Button className="!bg-[#3b5998] text-white">Facebook</Button>
      </Link>
    </div>
  );
}
