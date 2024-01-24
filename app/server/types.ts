import type {
  ActionFunction,
  DataFunctionArgs,
  LoaderFunction,
} from "@remix-run/node";

export type RouteFunction = (
  args: DataFunctionArgs,
) => ReturnType<ActionFunction> & ReturnType<LoaderFunction>;

export type DataFunctionValue = ReturnType<RouteFunction>;
