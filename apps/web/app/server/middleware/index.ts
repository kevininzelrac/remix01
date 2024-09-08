import { Builder } from "./Builder.server";
import { provideServerContext } from "./defaults/provideServerContext.server";

export const middleware = new Builder().use(provideServerContext);
