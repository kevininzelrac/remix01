import { AbstractFilter } from "./AbstractFilter";

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
