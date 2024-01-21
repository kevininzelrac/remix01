import type { ActionFunctionArgs } from "@remix-run/node";

export async function action({ request, context }: ActionFunctionArgs) {
  return context.sessionService.handleCredentialSignIn(request);
}
