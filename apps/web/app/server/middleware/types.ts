import type { Awaitable, AwaitableType } from "@app/utils/types";

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import type { ClientErrorData } from "../errors/types";

export type DataFunctionValue<T> = Response | NonNullable<T> | null;

export type DataFunctionArgs = LoaderFunctionArgs & ActionFunctionArgs;

export type RouteFunctionGeneric = (
  args: DataFunctionArgs,
) => Awaitable<DataFunctionValue<unknown>>;

export type RouteFunction<T extends Awaitable<DataFunctionValue<unknown>>> = (
  args: DataFunctionArgs,
) => Awaitable<
  | { success: true; data: AwaitableType<T>; error: null }
  | { success: false; data: null; error: ClientErrorData }
>;
