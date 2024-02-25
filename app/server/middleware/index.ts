import type { RouteFunction } from "../types";
import { Builder } from "./builder";
import { provideServerContext } from "./defaults";

export const middleware = new Builder<RouteFunction, RouteFunction>().use(
  provideServerContext,
);
