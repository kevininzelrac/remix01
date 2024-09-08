import { middleware } from "~/server/middleware";

export const loader = middleware.build(({ container }) => {
  return container.sessionService.handleSignOut();
});
