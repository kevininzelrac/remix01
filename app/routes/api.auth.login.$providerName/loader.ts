import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request, context, params }: LoaderFunctionArgs) {
  const providerName = params.providerName;
  return context.sessionService.redirectToOAuthProvider(providerName);
}
