import { QueryEngine } from "./QueryEngine";
import { Rule } from "./Rule";
import { AbstractFilter } from "./filters/AbstractFilter";
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

    const filterset: FilterReturnType<SubjectTypeFilters[SubjectType]>[] =
      rule.filters.map((item) => item.getFilter(...args));

    if (this._hasPromiseElement(filterset)) {
      return Promise.all(filterset).then((conditions) =>
        this._getQueryEngineCondition(
          subjectType,
          rule.filters,
          conditions as FilterLiteralType<SubjectTypeFilters[SubjectType]>[]
        )
      ) as any; // Trust me
    }

    return this._getQueryEngineCondition(
      subjectType,
      rule.filters,
      filterset as FilterLiteralType<SubjectTypeFilters[SubjectType]>[]
    ) as any; // Trust me
  }

  /*
  FIXME: HAVE NOT DECIDED HOW THESE MUST WORK.
  public can(action: A, subjectType: T) {}
  public cannot(action: A, subjectType: T) {}
  */

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

  private _getQueryEngineCondition<
    SubjectType extends keyof SubjectTypeFilters,
  >(
    subjectType: SubjectType,
    filters: AbstractFilter<
      any[],
      FilterReturnType<SubjectTypeFilters[SubjectType]>
    >[],
    conditions: FilterLiteralType<SubjectTypeFilters[SubjectType]>[]
  ) {
    const items = conditions.map((condition, idx) => {
      const negate = filters[idx].negate;

      if (typeof condition === "boolean") {
        if (condition) {
          condition = this.queryEngine.all(subjectType);
        } else {
          condition = this.queryEngine.none(subjectType);
        }
      }

      if (negate) {
        return this.queryEngine.negate(
          subjectType,
          condition as SubjectTypeFilters[SubjectType]
        );
      }
      return condition as SubjectTypeFilters[SubjectType];
    });

    return this.queryEngine.and(subjectType, ...items);
  }
}
