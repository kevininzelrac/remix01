import type { DataFunctionArgs } from "@remix-run/node";
import type { ClientErrorData } from "./errors";

export type Awaitable<T> = T | Promise<T>;

export type DataFunctionValue<T> = Response | NonNullable<T> | null;

export type RouteFunctionGeneric = (
  args: DataFunctionArgs,
) => Awaitable<DataFunctionValue<unknown>>;

export type UnwrapAwaitable<T> = T extends Promise<infer U> ? U : T;

export type RouteFunction<T extends Awaitable<DataFunctionValue<unknown>>> = (
  args: DataFunctionArgs,
) => Awaitable<
  | { success: true; data: UnwrapAwaitable<T> }
  | { success: false; error: ClientErrorData }
>;
