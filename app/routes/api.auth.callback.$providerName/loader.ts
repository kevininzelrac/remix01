import type { LoaderFunctionArgs } from "@remix-run/node";
import { withMiddleware } from "~/server/middleware/utils";

export const loader = withMiddleware(
  [],
  ({ request, context, params }: LoaderFunctionArgs) => {
    const providerName = params.providerName;
    if (!providerName) throw new Error("No provider name found.");
    return context.sessionService.handleOAuthResult(request, providerName);
  },
);
