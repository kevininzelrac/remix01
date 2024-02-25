import { Builder } from "./builder";
import { provideServerContext } from "./defaults";
export type * from "./types";

export const middleware = new Builder().use(provideServerContext);
