import { AssertionError } from "@app/utils/errors/AssertionError";
import { middleware } from "~/server/middleware";

export const loader = middleware.build(({ container, params }) => {
  const providerName = params.providerName;
  if (!providerName) throw new AssertionError("No provider name found.");
  return container.sessionService.redirectToOAuthProvider(providerName);
});
