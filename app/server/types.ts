import type {
  ActionFunction,
  DataFunctionArgs,
  LoaderFunction,
  TypedResponse,
} from "@remix-run/node";

export type RouteFunction = (
  args: DataFunctionArgs,
) => ReturnType<ActionFunction> & ReturnType<LoaderFunction>;

export type DataFunctionValue = ReturnType<RouteFunction>;

export type TypedResponseData<T> = T extends TypedResponse<infer U>
  ? U
  : T extends Promise<TypedResponse<infer U>>
    ? U
    : never;
