import { Builder } from "./Builder.server";
import { provideServerContext } from "./defaults/provideServerContext";

export const middleware = new Builder().use(provideServerContext);
