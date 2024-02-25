import type { ActionFunction } from "@remix-run/node";
import { middleware } from "~/server/middleware";

export const action: ActionFunction = middleware.build(
  ({ request, context }) => {
    return context.sessionService.handleCredentialSignIn(request);
  },
);
