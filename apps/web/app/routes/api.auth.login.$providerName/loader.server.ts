import { middleware } from "~/server/middleware";

export const loader = middleware.build(({ container, params }) => {
  const providerName = params.providerName;
  if (!providerName) throw new Error("No provider name found.");
  return container.sessionService.redirectToOAuthProvider(providerName);
});
