import { AbstractFilter } from "./filters/AbstractFilter";
import {
  BaseSubjectTypeFilters,
  FilterLiteralType,
  FilterReturnType,
} from "./types";

export class Rule<
  SubjectTypeFilters extends BaseSubjectTypeFilters,
  SubjectType extends keyof SubjectTypeFilters,
  Args extends any[] = [],
  IsPromise extends boolean = false,
> {
  constructor(
    public filters: AbstractFilter<
      Args,
      IsPromise extends true
        ? FilterReturnType<SubjectTypeFilters[SubjectType]>
        : FilterLiteralType<SubjectTypeFilters[SubjectType]>
    >[] = []
  ) {}
}
