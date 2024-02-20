import type { ActionFunctionArgs } from "@remix-run/node";

export const action = ({ request, context }: ActionFunctionArgs) => {
  return context.sessionService.handleCredentialSignIn(request);
};
