import type { RouteFunction } from "../types";

export class Builder<T extends (...args: any[]) => any> {
  constructor(private _middlewareList: any[] = []) {}

  use<F extends (...args: any[]) => any>(
    currentMiddleware: (next: F) => T,
  ): Builder<F> {
    return new Builder([currentMiddleware, ...this._middlewareList]);
  }

  build<S extends T>(final: S): RouteFunction<ReturnType<S>> {
    let result = final as any;
    for (const currentMiddleware of this._middlewareList) {
      result = currentMiddleware(result);
    }
    return result;
  }
}
