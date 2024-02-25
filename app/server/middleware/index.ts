import type { RouteFunctionGeneric } from "../types";
import { Builder } from "./builder";
import type { ProvideServerContextNext } from "./defaults";
import { provideServerContext } from "./defaults";

export const middleware =
  new Builder<RouteFunctionGeneric>().use<ProvideServerContextNext>(
    provideServerContext,
  );
