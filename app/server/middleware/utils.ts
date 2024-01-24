import type {
  ActionFunction,
  DataFunctionArgs,
  LoaderFunction,
} from "@remix-run/node";
import { errorBoundary } from "./errorBoundary";

export type RouteFunction = (
  args: DataFunctionArgs,
) => ReturnType<ActionFunction> & ReturnType<LoaderFunction>;

export type Middleware<T extends RouteFunction> = (f: T) => T;

const defaultMiddleware: Middleware<RouteFunction>[] = [errorBoundary];

export function withMiddleware<T extends RouteFunction>(
  middleware: Middleware<T>[],
  func: T,
): T {
  const middlewareToApply = [...middleware, ...(defaultMiddleware as any[])];
  let current = func;
  for (const wrapper of middlewareToApply) {
    current = wrapper(current);
  }
  return current;
}
