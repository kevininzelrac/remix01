import { QueryEngine } from "./QueryEngine";
import { Rule } from "./Rule";
import { AbstractFilter, EvaluationContext } from "./filters/AbstractFilter";
import { FunctionFilter } from "./filters/FunctionFilter";
import { LiteralFilter } from "./filters/LiteralFilter";
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
} from "./types";

export class RuleSet<
  SubjectTypeFilters extends BaseSubjectTypeFilters,
  Repository extends BaseRepository<SubjectTypeFilters> = {},
> {
  constructor(
    private queryEngine: QueryEngine<SubjectTypeFilters>,
    private rules: Repository
  ) {}

  public static new<STF extends {}>(
    queryEngine: QueryEngine<STF>
  ): RuleSet<STF, {}> {
    return new RuleSet(queryEngine, {});
  }

  // Signature
  public allow<
    Action extends string,
    SubjectType extends keyof SubjectTypeFilters,
  >(
    action: Action,
    subjectType: SubjectType
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
    condition: Condition
  ): RuleSet<
    SubjectTypeFilters,
    AddRule<SubjectTypeFilters, Repository, Action, SubjectType, [], false>
  >;
  public allow<
    Action extends string,
    SubjectType extends keyof SubjectTypeFilters,
    Condition extends (
      ...args: any[]
    ) => FilterReturnType<SubjectTypeFilters[SubjectType]>,
  >(
    action: Action,
    subjectType: SubjectType,
    condition: Condition
  ): RuleSet<
    SubjectTypeFilters,
    AddRule<
      SubjectTypeFilters,
      Repository,
      Action,
      SubjectType,
      Parameters<Condition>,
      Promise<any> extends ReturnType<Condition> ? true : false
    >
  >;
  public allow<
    Action extends string,
    SubjectType extends keyof SubjectTypeFilters,
    Condition extends AbstractFilter<
      any[],
      FilterReturnType<SubjectTypeFilters[SubjectType]>
    >,
  >(
    action: Action,
    subjectType: SubjectType,
    condition: Condition
  ): RuleSet<
    SubjectTypeFilters,
    AddRule<
      SubjectTypeFilters,
      Repository,
      Action,
      SubjectType,
      AbstractFilterArgsType<Condition>,
      Promise<any> extends AbstractFilterReturnType<Condition> ? true : false
    >
  >;

  // Implementation
  public allow<
    Action extends string,
    SubjectType extends keyof SubjectTypeFilters,
  >(action: Action, subjectType: SubjectType, condition?: any): any {
    return this._addRule(false, action, subjectType, condition);
  }

  public forbid<
    Action extends string,
    SubjectType extends keyof SubjectTypeFilters,
  >(
    action: Action,
    subjectType: SubjectType
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
    condition: Condition
  ): RuleSet<
    SubjectTypeFilters,
    AddRule<SubjectTypeFilters, Repository, Action, SubjectType, [], false>
  >;
  public forbid<
    Action extends string,
    SubjectType extends keyof SubjectTypeFilters,
    Condition extends (
      ...args: any[]
    ) => FilterReturnType<SubjectTypeFilters[SubjectType]>,
  >(
    action: Action,
    subjectType: SubjectType,
    condition: Condition
  ): RuleSet<
    SubjectTypeFilters,
    AddRule<
      SubjectTypeFilters,
      Repository,
      Action,
      SubjectType,
      AbstractFilterArgsType<Condition>,
      Promise<any> extends AbstractFilterReturnType<Condition> ? true : false
    >
  >;
  public forbid<
    Action extends string,
    SubjectType extends keyof SubjectTypeFilters,
    Condition extends AbstractFilter<
      any[],
      FilterReturnType<SubjectTypeFilters[SubjectType]>
    >,
  >(
    action: Action,
    subjectType: SubjectType,
    condition: Condition
  ): RuleSet<
    SubjectTypeFilters,
    AddRule<
      SubjectTypeFilters,
      Repository,
      Action,
      SubjectType,
      AbstractFilterArgsType<Condition>,
      Promise<any> extends AbstractFilterReturnType<Condition> ? true : false
    >
  >;

  // Implementation
  public forbid<
    Action extends string,
    SubjectType extends keyof SubjectTypeFilters,
  >(action: Action, subjectType: SubjectType, condition?: any): any {
    return this._addRule(true, action, subjectType, condition);
  }

  public accessible<
    Action extends keyof Repository,
    SubjectType extends keyof Repository[Action] & keyof SubjectTypeFilters,
    Args extends RuleArgs<Repository[Action][SubjectType]> & any[],
    IsPromise extends RuleIsPromise<Repository[Action][SubjectType]>,
  >(
    action: Action,
    subjectType: SubjectType,
    ...args: Args
  ): IsPromise extends true
    ? Promise<SubjectTypeFilters[SubjectType]>
    : SubjectTypeFilters[SubjectType] {
    const rule = this._getRule(action, subjectType);

    const evaluationContexts: EvaluationContext<
      FilterReturnType<SubjectTypeFilters[SubjectType]>
    >[] = rule.filters.map((item) => item.getEvaluationContext(...args));

    return this._handleResolvedEvaluationContexts(
      subjectType,
      evaluationContexts,
      (resolvedEvaluationContexts) =>
        this._getQueryEngineCondition(subjectType, resolvedEvaluationContexts)
    );
  }

  public can<
    Action extends keyof Repository,
    SubjectType extends keyof Repository[Action] & keyof SubjectTypeFilters,
    Args extends RuleArgs<Repository[Action][SubjectType]> & any[],
    IsPromise extends RuleIsPromise<Repository[Action][SubjectType]>,
  >(
    action: Action,
    subjectType: SubjectType,
    ...args: Args
  ): IsPromise extends true ? Promise<boolean> : boolean {
    const rule = this._getRule(action, subjectType);

    const evaluationContexts: EvaluationContext<
      FilterReturnType<SubjectTypeFilters[SubjectType]>
    >[] = rule.filters.map((item) => item.getEvaluationContext(...args));

    return this._handleResolvedEvaluationContexts(
      subjectType,
      evaluationContexts,
      (resolvedEvaluationContexts) =>
        this._evaluateCanDo(subjectType, resolvedEvaluationContexts)
    );
  }

  public cannot<
    Action extends keyof Repository,
    SubjectType extends keyof Repository[Action] & keyof SubjectTypeFilters,
    Args extends RuleArgs<Repository[Action][SubjectType]> & any[],
    IsPromise extends RuleIsPromise<Repository[Action][SubjectType]>,
  >(
    action: Action,
    subjectType: SubjectType,
    ...args: Args
  ): IsPromise extends true ? Promise<boolean> : boolean {
    const result = this.can(action, subjectType, ...args);

    if (this._isPromise(result)) {
      return result.then((value) => !value) as any; // Trust me
    }

    return !(result as boolean) as any; // Trust me
  }

  // Private methods
  private _addRule(
    negate: boolean,
    action: keyof Repository,
    subjectType: keyof SubjectTypeFilters,
    condition: any
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

    this.rules[action] = this.rules[action] ?? ({} as any);
    this.rules[action]![subjectType] =
      this.rules[action]![subjectType] ?? (new Rule() as any);

    const rule = this.rules[action]![subjectType]!;
    rule.filters.push(condition);
    return this;
  }

  private _getRule<
    Action extends keyof Repository,
    SubjectType extends keyof Repository[Action] & keyof SubjectTypeFilters,
    Args extends RuleArgs<Repository[Action][SubjectType]> & any[],
    IsPromise extends RuleIsPromise<Repository[Action][SubjectType]>,
  >(
    action: Action,
    subjectType: SubjectType
  ): Rule<SubjectTypeFilters, SubjectType, Args, IsPromise> {
    const actionConfig = this.rules[action];
    if (!actionConfig) {
      throw new Error(`No rule found for action: ${action as string}.`);
    }

    const rule = actionConfig[subjectType];
    if (!rule) {
      throw new Error(
        `No rule found for action: ${action as string}, subject type: ${subjectType as string}.`
      );
    }

    if (rule.filters.length === 0) {
      throw new Error(
        `No filters found on rule for action: ${action as string}, subject type: ${subjectType as string}.`
      );
    }

    return rule;
  }

  private _hasPromiseElement<T>(
    array: (T | Promise<T>)[]
  ): array is Promise<T>[] {
    return array.some((item) => this._isPromise<T>(item));
  }

  private _isPromise<T>(value: any): value is Promise<T> {
    return (
      value !== null &&
      (typeof value === "object" || typeof value === "function") &&
      typeof value.then === "function"
    );
  }

  private _evaluateCanDo<SubjectType extends keyof SubjectTypeFilters>(
    _subjectType: SubjectType,
    conditions: EvaluationContext<
      FilterLiteralType<SubjectTypeFilters[SubjectType]>
    >[]
  ): boolean {
    let queryFound = false;
    for (const { negate, filter } of conditions) {
      if (typeof filter === "boolean") {
        if (negate) {
          return !filter;
        }
        return filter;
      }
      queryFound = true;
    }
    return queryFound;
  }

  private _getQueryEngineCondition<
    SubjectType extends keyof SubjectTypeFilters,
  >(
    subjectType: SubjectType,
    conditions: EvaluationContext<
      FilterLiteralType<SubjectTypeFilters[SubjectType]>
    >[]
  ): SubjectTypeFilters[SubjectType] {
    const items = conditions.map(({ negate, filter }) => {
      if (typeof filter === "boolean") {
        if (filter) {
          filter = this.queryEngine.all(subjectType);
        } else {
          filter = this.queryEngine.none(subjectType);
        }
      }

      if (negate) {
        return this.queryEngine.negate(
          subjectType,
          filter as SubjectTypeFilters[SubjectType]
        );
      }
      return filter as SubjectTypeFilters[SubjectType];
    });

    return this.queryEngine.and(subjectType, ...items);
  }

  private _handleResolvedEvaluationContexts<
    IsPromise extends boolean,
    SubjectType extends keyof SubjectTypeFilters,
    Callback extends (
      evaluationContexts: EvaluationContext<
        FilterLiteralType<SubjectTypeFilters[SubjectType]>
      >[]
    ) => any,
  >(
    _subjectType: SubjectType,
    evaluationContexts: EvaluationContext<
      FilterReturnType<SubjectTypeFilters[SubjectType]>
    >[],
    callback: Callback
  ): IsPromise extends true
    ? Promise<ReturnType<Callback>>
    : ReturnType<Callback> {
    const filterset = evaluationContexts.map((item) => item.filter);

    if (this._hasPromiseElement(filterset)) {
      // After this point: IsPromise is true
      const resolvedFiltersetPromise: Promise<
        FilterLiteralType<SubjectTypeFilters[SubjectType]>[]
      > = Promise.all(filterset) as any;

      return resolvedFiltersetPromise
        .then((resolvedFilterset) =>
          resolvedFilterset.map(
            (filter, idx) =>
              ({
                negate: evaluationContexts[idx].negate,
                filter,
              }) as EvaluationContext<
                FilterLiteralType<SubjectTypeFilters[SubjectType]>
              >
          )
        )
        .then((resolvedEvaluationContexts) =>
          callback(resolvedEvaluationContexts)
        ) as any; // Trust me
    }

    return callback(
      evaluationContexts as EvaluationContext<
        FilterLiteralType<SubjectTypeFilters[SubjectType]>
      >[]
    ) as any; // Trust me
  }
}
