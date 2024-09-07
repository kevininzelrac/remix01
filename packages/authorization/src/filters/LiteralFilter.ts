import { AbstractFilter } from "~/filters/AbstractFilter.js";

export class LiteralFilter<LiteralType> extends AbstractFilter<
  [],
  LiteralType
> {
  constructor(
    negate: boolean,
    private filter: LiteralType,
  ) {
    super(negate);
  }

  getFilter(): LiteralType {
    return this.filter;
  }
}
