import { EvaluatedRule } from "./EvaluatedRule.js";
import { QueryEngine } from "./QueryEngine.js";
import { Rule } from "./Rule.js";
import { AbstractFilter, EvaluationContext } from "./filters/AbstractFilter.js";
import { FunctionFilter } from "./filters/FunctionFilter.js";
import { LiteralFilter } from "./filters/LiteralFilter.js";
import {
  AbstractFilterArgsType,
  AbstractFilterReturnType,
  AddRule,
  BaseRepository,
  BaseSubjectTypeFilters,
  FilterLiteralType,
  FilterReturnType,
  RuleArgs,
  RuleIsPromise,
} from "./types.js";

export class RuleSet<
  SubjectTypeFilters extends BaseSubjectTypeFilters,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  Repository extends BaseRepository<SubjectTypeFilters> = {},
> {
  constructor(
    private queryEngine: QueryEngine<SubjectTypeFilters>,
    private rules: Repository,
  ) {}

  public static new<STF extends object>(
    queryEngine: QueryEngine<STF>,
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  ): RuleSet<STF, {}> {
    return new RuleSet(queryEngine, {});
  }

  // Signature
  public allow<
    Action extends string,
    SubjectType extends keyof SubjectTypeFilters,
  >(
    action: Action,
    subjectType: SubjectType,
  ): RuleSet<
    SubjectTypeFilters,
    AddRule<SubjectTypeFilters, Repository, Action, SubjectType, [], false>
  >;
  public allow<
    Action extends string,
    SubjectType extends keyof SubjectTypeFilters,
    Condition extends SubjectTypeFilters[SubjectType],
  >(
    action: Action,
    subjectType: SubjectType,
    condition: Condition,
  ): RuleSet<
    SubjectTypeFilters,
    AddRule<SubjectTypeFilters, Repository, Action, SubjectType, [], false>
  >;
  public allow<
    Action extends string,
    SubjectType extends keyof SubjectTypeFilters,
    Condition extends (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...args: any[]
    ) => FilterReturnType<SubjectTypeFilters[SubjectType]>,
  >(
    action: Action,
    subjectType: SubjectType,
    condition: Condition,
  ): RuleSet<
    SubjectTypeFilters,
    AddRule<
      SubjectTypeFilters,
      Repository,
      Action,
      SubjectType,
      Parameters<Condition>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Promise<any> extends ReturnType<Condition> ? true : false
    >
  >;
  public allow<
    Action extends string,
    SubjectType extends keyof SubjectTypeFilters,
    Condition extends AbstractFilter<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any[],
      FilterReturnType<SubjectTypeFilters[SubjectType]>
    >,
  >(
    action: Action,
    subjectType: SubjectType,
    condition: Condition,
  ): RuleSet<
    SubjectTypeFilters,
    AddRule<
      SubjectTypeFilters,
      Repository,
      Action,
      SubjectType,
      AbstractFilterArgsType<Condition>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Promise<any> extends AbstractFilterReturnType<Condition> ? true : false
    >
  >;

  // Implementation
  public allow<
    Action extends string,
    SubjectType extends keyof SubjectTypeFilters,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  >(action: Action, subjectType: SubjectType, condition?: any): any {
    return this._addRule(false, action, subjectType, condition);
  }

  public forbid<
    Action extends string,
    SubjectType extends keyof SubjectTypeFilters,
  >(
    action: Action,
    subjectType: SubjectType,
  ): RuleSet<
    SubjectTypeFilters,
    AddRule<SubjectTypeFilters, Repository, Action, SubjectType, [], false>
  >;
  public forbid<
    Action extends string,
    SubjectType extends keyof SubjectTypeFilters,
    Condition extends SubjectTypeFilters[SubjectType],
  >(
    action: Action,
    subjectType: SubjectType,
    condition: Condition,
  ): RuleSet<
    SubjectTypeFilters,
    AddRule<SubjectTypeFilters, Repository, Action, SubjectType, [], false>
  >;
  public forbid<
    Action extends string,
    SubjectType extends keyof SubjectTypeFilters,
    Condition extends (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...args: any[]
    ) => FilterReturnType<SubjectTypeFilters[SubjectType]>,
  >(
    action: Action,
    subjectType: SubjectType,
    condition: Condition,
  ): RuleSet<
    SubjectTypeFilters,
    AddRule<
      SubjectTypeFilters,
      Repository,
      Action,
      SubjectType,
      AbstractFilterArgsType<Condition>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Promise<any> extends AbstractFilterReturnType<Condition> ? true : false
    >
  >;
  public forbid<
    Action extends string,
    SubjectType extends keyof SubjectTypeFilters,
    Condition extends AbstractFilter<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any[],
      FilterReturnType<SubjectTypeFilters[SubjectType]>
    >,
  >(
    action: Action,
    subjectType: SubjectType,
    condition: Condition,
  ): RuleSet<
    SubjectTypeFilters,
    AddRule<
      SubjectTypeFilters,
      Repository,
      Action,
      SubjectType,
      AbstractFilterArgsType<Condition>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Promise<any> extends AbstractFilterReturnType<Condition> ? true : false
    >
  >;

  // Implementation
  public forbid<
    Action extends string,
    SubjectType extends keyof SubjectTypeFilters,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  >(action: Action, subjectType: SubjectType, condition?: any): any {
    return this._addRule(true, action, subjectType, condition);
  }

  public getRule<
    Action extends keyof Repository,
    SubjectType extends keyof Repository[Action] & keyof SubjectTypeFilters,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Args extends RuleArgs<Repository[Action][SubjectType]> & any[],
    IsPromise extends RuleIsPromise<Repository[Action][SubjectType]>,
  >(
    action: Action,
    subjectType: SubjectType,
    ...args: Args
  ): IsPromise extends true
    ? Promise<EvaluatedRule<SubjectTypeFilters, SubjectType>>
    : EvaluatedRule<SubjectTypeFilters, SubjectType> {
    return this._handleEvaluatedRule(
      action,
      subjectType,
      args,
      (evaluatedRule) => evaluatedRule,
    );
  }

  public accessible<
    Action extends keyof Repository,
    SubjectType extends keyof Repository[Action] & keyof SubjectTypeFilters,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Args extends RuleArgs<Repository[Action][SubjectType]> & any[],
    IsPromise extends RuleIsPromise<Repository[Action][SubjectType]>,
  >(
    action: Action,
    subjectType: SubjectType,
    ...args: Args
  ): IsPromise extends true
    ? Promise<SubjectTypeFilters[SubjectType]>
    : SubjectTypeFilters[SubjectType] {
    return this._handleEvaluatedRule(
      action,
      subjectType,
      args,
      (evaluatedRule) => evaluatedRule.accessible(),
    );
  }

  public can<
    Action extends keyof Repository,
    SubjectType extends keyof Repository[Action] & keyof SubjectTypeFilters,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Args extends RuleArgs<Repository[Action][SubjectType]> & any[],
    IsPromise extends RuleIsPromise<Repository[Action][SubjectType]>,
  >(
    action: Action,
    subjectType: SubjectType,
    ...args: Args
  ): IsPromise extends true ? Promise<boolean> : boolean {
    return this._handleEvaluatedRule(
      action,
      subjectType,
      args,
      (evaluatedRule) => evaluatedRule.can(),
    );
  }

  public cannot<
    Action extends keyof Repository,
    SubjectType extends keyof Repository[Action] & keyof SubjectTypeFilters,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Args extends RuleArgs<Repository[Action][SubjectType]> & any[],
    IsPromise extends RuleIsPromise<Repository[Action][SubjectType]>,
  >(
    action: Action,
    subjectType: SubjectType,
    ...args: Args
  ): IsPromise extends true ? Promise<boolean> : boolean {
    return this._handleEvaluatedRule(
      action,
      subjectType,
      args,
      (evaluatedRule) => evaluatedRule.can(),
    );
  }

  // Private methods
  private _addRule(
    negate: boolean,
    action: keyof Repository,
    subjectType: keyof SubjectTypeFilters,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    condition: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    if (!(condition instanceof AbstractFilter)) {
      if (typeof condition === "function") {
        condition = new FunctionFilter(negate, condition);
      } else if (typeof condition === "undefined") {
        condition = new LiteralFilter(negate, true);
      } else {
        condition = new LiteralFilter(negate, condition);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.rules[action] = this.rules[action] ?? ({} as any); // Trust me
    this.rules[action]![subjectType] =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.rules[action]![subjectType] ?? (new Rule() as any); // Trust me

    const rule = this.rules[action]![subjectType]!;
    rule.filters.push(condition);
    return this;
  }

  private _getInternalRule<
    Action extends keyof Repository,
    SubjectType extends keyof Repository[Action] & keyof SubjectTypeFilters,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Args extends RuleArgs<Repository[Action][SubjectType]> & any[],
    IsPromise extends RuleIsPromise<Repository[Action][SubjectType]>,
  >(
    action: Action,
    subjectType: SubjectType,
  ): Rule<SubjectTypeFilters, SubjectType, Args, IsPromise> {
    const actionConfig = this.rules[action];
    if (!actionConfig) {
      throw new Error(`No rule found for action: ${action as string}.`);
    }

    const rule = actionConfig[subjectType];
    if (!rule) {
      throw new Error(
        `No rule found for action: ${action as string}, subject type: ${subjectType as string}.`,
      );
    }

    if (rule.filters.length === 0) {
      throw new Error(
        `No filters found on rule for action: ${action as string}, subject type: ${subjectType as string}.`,
      );
    }

    return rule;
  }

  private _handleEvaluatedRule<
    Action extends keyof Repository,
    SubjectType extends keyof Repository[Action] & keyof SubjectTypeFilters,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Args extends RuleArgs<Repository[Action][SubjectType]> & any[],
    IsPromise extends RuleIsPromise<Repository[Action][SubjectType]>,
    Callback extends (
      evaluatedRule: EvaluatedRule<SubjectTypeFilters, SubjectType>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => any,
  >(
    action: Action,
    subjectType: SubjectType,
    args: Args,
    callback: Callback,
  ): IsPromise extends true
    ? Promise<ReturnType<Callback>>
    : ReturnType<Callback> {
    const rule = this._getInternalRule(action, subjectType);

    const evaluationContexts: EvaluationContext<
      FilterReturnType<SubjectTypeFilters[SubjectType]>
    >[] = rule.filters.map((item) => item.getEvaluationContext(...args));

    const filterset = evaluationContexts.map((item) => item.filter);

    if (hasPromiseElement(filterset)) {
      // After this point: IsPromise is true
      const resolvedFiltersetPromise: Promise<
        FilterLiteralType<SubjectTypeFilters[SubjectType]>[]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      > = Promise.all(filterset) as any; // Trust me

      return resolvedFiltersetPromise
        .then((resolvedFilterset) =>
          resolvedFilterset.map(
            (filter, idx) =>
              ({
                negate: evaluationContexts[idx].negate,
                filter,
              }) as EvaluationContext<
                FilterLiteralType<SubjectTypeFilters[SubjectType]>
              >,
          ),
        )
        .then(
          (resolvedEvaluationContexts) =>
            callback(
              new EvaluatedRule(
                subjectType,
                this.queryEngine,
                resolvedEvaluationContexts,
              ),
            ),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as any; // Trust me
    }

    return callback(
      new EvaluatedRule(
        subjectType,
        this.queryEngine,
        evaluationContexts as EvaluationContext<
          FilterLiteralType<SubjectTypeFilters[SubjectType]>
        >[],
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any; // Trust me
  }
}

function hasPromiseElement<T>(
  array: (T | Promise<T>)[],
): array is Promise<T>[] {
  return array.some((item) => isPromise<T>(item));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPromise<T>(value: any): value is Promise<T> {
  return (
    value !== null &&
    (typeof value === "object" || typeof value === "function") &&
    typeof value.then === "function"
  );
}
