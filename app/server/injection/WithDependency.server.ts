import type { Dependency } from "./Dependency.server";

export type WithDependency<T extends object> = {
  [K in keyof T]: T[K] & Dependency<T>;
};
