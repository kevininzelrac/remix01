export interface Dependency<C extends object> {
  init(context: C): void;
}
