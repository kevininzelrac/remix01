import type {
  ActionFunction,
  DataFunctionArgs,
  LoaderFunction,
} from "@remix-run/node";
import { errorBoundary } from "./errorBoundary";

export type RouteFunction = (
  args: DataFunctionArgs,
) => ReturnType<ActionFunction> & ReturnType<LoaderFunction>;

export type Middleware = (f: RouteFunction) => RouteFunction;

const defaultMiddleware: Middleware[] = [errorBoundary];

export function withMiddleware(
  middleware: Middleware[],
  func: RouteFunction,
): RouteFunction {
  const middlewareToApply = [...middleware, ...defaultMiddleware];
  let current = func;
  for (const wrapper of middlewareToApply) {
    current = wrapper(current);
  }
  return current;
}
