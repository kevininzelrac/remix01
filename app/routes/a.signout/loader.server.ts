import { middleware } from "~/server/middleware";

export const loader = middleware.build(({ context }) => {
  return context.sessionService.handleSignOut();
});
