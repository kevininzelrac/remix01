import { AbstractFilter } from "./AbstractFilter";

export class FunctionFilter<
  Args extends any[],
  ReturnType,
> extends AbstractFilter<Args, ReturnType> {
  constructor(
    negate: boolean,
    private fn: (...args: Args) => ReturnType
  ) {
    super(negate);
  }

  getFilter(...args: Args): ReturnType {
    return this.fn(...args);
  }
}
