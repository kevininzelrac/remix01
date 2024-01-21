import type { LoaderFunctionArgs } from "@remix-run/node";

export function loader({ context }: LoaderFunctionArgs) {
  return context.sessionService.handleSignOut();
}
