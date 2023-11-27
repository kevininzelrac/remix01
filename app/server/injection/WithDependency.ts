import type { Dependency } from "./Dependency";

export type WithDependency<T extends object> = {
  [K in keyof T]: T[K] & Dependency<T>;
};
