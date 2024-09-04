import { FilterReturnType } from "~/types";
import { AbstractFilter } from "./AbstractFilter";

export class FunctionFilter<
  Filter,
  Args extends any[],
  ReturnType extends FilterReturnType<Filter>,
> extends AbstractFilter<Filter, Args, ReturnType> {
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
