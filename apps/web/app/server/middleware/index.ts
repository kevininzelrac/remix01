import { Builder } from "./Builder.server.js";
import { provideServerContext } from "./defaults/provideServerContext.server.js";

export const middleware = new Builder().use(provideServerContext);
