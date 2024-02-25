export class Builder<T extends Function, B extends Function> {
  constructor(private _middlewareList: any[] = []) {}

  use<F extends Function = never>(
    currentMiddleware: (next: F) => T,
  ): Builder<F, B> {
    return new Builder([currentMiddleware, ...this._middlewareList]);
  }

  build(final: T): B {
    let result = final as any;
    for (const currentMiddleware of this._middlewareList) {
      result = currentMiddleware(result);
    }
    return result;
  }
}
