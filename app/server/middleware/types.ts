import type { DataFunctionArgs } from "@remix-run/node";
import type { ClientErrorData } from "../errors";
import type { Awaitable, AwaitableType } from "../types";

export type DataFunctionValue<T> = Response | NonNullable<T> | null;

export type RouteFunctionGeneric = (
  args: DataFunctionArgs,
) => Awaitable<DataFunctionValue<unknown>>;

export type RouteFunction<T extends Awaitable<DataFunctionValue<unknown>>> = (
  args: DataFunctionArgs,
) => Awaitable<
  | { success: true; data: AwaitableType<T>; error: null }
  | { success: false; data: null; error: ClientErrorData }
>;
