import { middleware } from "~/server/middleware";

export const loader = middleware.build(({ context, params }) => {
  const providerName = params.providerName;
  if (!providerName) throw new Error("No provider name found.");
  return context.sessionService.redirectToOAuthProvider(providerName);
});
