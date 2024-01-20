/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

import type { ServerContext } from "~/server/interfaces";

declare module "@remix-run/server-runtime" {
  export interface AppLoadContext extends ServerContext {}
}
