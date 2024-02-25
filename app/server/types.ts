import type { DataFunctionArgs } from "@remix-run/node";

export type Awaitable<T> = T | Promise<T>;

export type DataFunctionValue<T> = Response | NonNullable<T> | null;

export type RouteFunction = <T>(
  args: DataFunctionArgs,
) => Awaitable<DataFunctionValue<T>>;
