import { middleware } from "~/server/middleware/index.js";

export const action = middleware.build(({ request, container }) => {
  return container.sessionService.handleCredentialSignUp(request);
});
