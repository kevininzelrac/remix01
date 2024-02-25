import { middleware } from "~/server/middleware";

export const action = middleware.build(({ request, context }) => {
  return context.sessionService.handleCredentialSignIn(request);
});
