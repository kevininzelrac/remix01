import type { ActionFunctionArgs } from "@remix-run/node";
import { withMiddleware } from "~/server/middleware/utils";

export const action = withMiddleware(
  [],
  ({ request, context }: ActionFunctionArgs) => {
    return context.sessionService.handleCredentialSignIn(request);
  },
);
