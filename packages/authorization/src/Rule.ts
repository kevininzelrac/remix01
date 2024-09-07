import { AbstractFilter } from "./filters/AbstractFilter";
import {
  BaseSubjectTypeFilters,
  FilterLiteralType,
  FilterReturnType,
} from "./types";

export class Rule<
  SubjectTypeFilters extends BaseSubjectTypeFilters,
  SubjectType extends keyof SubjectTypeFilters,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Args extends any[] = [],
  IsPromise extends boolean = false,
> {
  constructor(
    public filters: AbstractFilter<
      Args,
      IsPromise extends true
        ? FilterReturnType<SubjectTypeFilters[SubjectType]>
        : FilterLiteralType<SubjectTypeFilters[SubjectType]>
    >[] = [],
  ) {}
}
