import { middleware } from "../../server/middleware/index.js";

export const loader = middleware.build(({ container }) => {
  return container.sessionService.handleSignOut();
});
