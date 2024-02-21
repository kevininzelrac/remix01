import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { authGuard } from "~/server/permissions";

import type { TypedResponseData } from "~/server/types";

export const loader = async (args: LoaderFunctionArgs) => {
  const { user } = await authGuard(args);

  return json({
    user: {
      fullName: user.fullName,
      avatar: user.avatar,
    },
  });
};

export type ProfileProps = TypedResponseData<ReturnType<typeof loader>>;
