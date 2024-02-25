import { Builder } from "./builder";
import { provideServerContext } from "./defaults";

export const middleware = new Builder().use(provideServerContext);
