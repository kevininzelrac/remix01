export abstract class AbstractFilter<Args extends any[], ReturnType> {
  constructor(public negate: boolean) {}

  abstract getFilter(...args: Args): ReturnType;
}
