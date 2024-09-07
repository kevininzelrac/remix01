export type EvaluationContext<ReturnType> = {
  negate: boolean;
  filter: ReturnType;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
