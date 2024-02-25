/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

import "@remix-run/server-runtime";

import type { Container } from "~/server/services/container.server";

declare module "@remix-run/server-runtime" {
  export interface AppLoadContext {
    container: Container;
  }
}
