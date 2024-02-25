import type { RouteFunction } from "../types";
import { Builder } from "./builder";
import type { ProvideServerContextNext } from "./defaults";
import { provideServerContext } from "./defaults";

export const middleware = new Builder<
  RouteFunction,
  RouteFunction
>().use<ProvideServerContextNext>(provideServerContext);
