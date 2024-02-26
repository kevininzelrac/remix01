import { middleware } from "~/server/middleware";

export const loader = middleware.build(({ request, container, params }) => {
  const providerName = params.providerName;
  if (!providerName) throw new Error("No provider name found.");
  return container.sessionService.handleOAuthResult(request, providerName);
});
