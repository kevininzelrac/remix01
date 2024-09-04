import { AbstractFilter } from "./filters/AbstractFilter";

export class Rule<FilterType extends AbstractFilter<any, any[], any>> {
  constructor(public filters: FilterType[] = []) {}
}
