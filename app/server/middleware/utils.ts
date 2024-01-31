import type {
  ActionFunction,
  DataFunctionArgs,
  LoaderFunction,
} from "@remix-run/node";

export type RouteFunction = (
  args: DataFunctionArgs,
) => ReturnType<ActionFunction> & ReturnType<LoaderFunction>;

export type Middleware<T extends RouteFunction> = (f: T) => T;

export function withMiddleware<T extends RouteFunction>(
  middleware: Middleware<T>[],
  func: T,
): T {
  let current = func;
  for (const wrapper of middleware) {
    current = wrapper(current);
  }
  return current;
}
