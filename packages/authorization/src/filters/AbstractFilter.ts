import { FilterReturnType } from "~/types";

export abstract class AbstractFilter<
  Filter,
  Args extends any[],
  ReturnType extends FilterReturnType<Filter>,
> {
  constructor(public negate: boolean) {}

  abstract getFilter(...args: Args): ReturnType;
}
