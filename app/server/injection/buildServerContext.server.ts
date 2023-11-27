import type { Dependency } from "./Dependency.server";

export function buildServerContext<S extends { [key: string]: Dependency<S> }>(
  context: S,
): S {
  for (const [, dependency] of Object.entries(context)) {
    dependency.init(context);
  }
  return context;
}
