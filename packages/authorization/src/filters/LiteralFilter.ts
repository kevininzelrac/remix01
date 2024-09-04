import { FilterLiteralType } from "~/types";
import { AbstractFilter } from "./AbstractFilter";

export class LiteralFilter<
  Filter,
  LiteralType extends FilterLiteralType<Filter>,
> extends AbstractFilter<Filter, [], LiteralType> {
  constructor(
    negate: boolean,
    private filter: LiteralType
  ) {
    super(negate);
  }

  getFilter(): LiteralType {
    return this.filter;
  }
}
