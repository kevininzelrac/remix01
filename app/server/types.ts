import type { DataFunctionArgs } from "@remix-run/node";
import type { ClientErrorData } from "./errors";

export type Awaitable<T> = T | Promise<T>;

export type DataFunctionValue<T> = Response | NonNullable<T> | null;

export type RouteFunctionGeneric = <T>(
  args: DataFunctionArgs,
) => Awaitable<DataFunctionValue<T>>;

export type RouteFunction<T extends DataFunctionValue<unknown>> = (
  args: DataFunctionArgs,
) => Awaitable<
  { success: true; data: T } | { success: false; error: ClientErrorData }
>;
