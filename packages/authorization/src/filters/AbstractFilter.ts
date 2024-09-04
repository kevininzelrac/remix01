export type EvaluationContext<ReturnType> = {
  negate: boolean;
  filter: ReturnType;
};

export abstract class AbstractFilter<Args extends any[], ReturnType> {
  constructor(public negate: boolean) {}

  abstract getFilter(...args: Args): ReturnType;

  getEvaluationContext(...args: Args): EvaluationContext<ReturnType> {
    return {
      negate: this.negate,
      filter: this.getFilter(...args),
    };
  }
}
