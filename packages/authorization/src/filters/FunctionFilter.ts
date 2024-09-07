import { AbstractFilter } from "./AbstractFilter.js";

export class FunctionFilter<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Args extends any[],
  ReturnType,
> extends AbstractFilter<Args, ReturnType> {
  constructor(
    negate: boolean,
    private fn: (...args: Args) => ReturnType,
  ) {
    super(negate);
  }

  getFilter(...args: Args): ReturnType {
    return this.fn(...args);
  }
}
