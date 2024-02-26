import { middleware } from "~/server/middleware";

export const action = middleware.build(({ request, container }) => {
  return container.sessionService.handleCredentialSignIn(request);
});
