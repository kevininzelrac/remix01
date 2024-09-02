class RuleSet<SubjectTypeFilters extends {}, Repository extends {} = {}> {
  constructor(
    private queryEngine: QueryEngine<SubjectTypeFilters>,
    private rules: Repository = {} as unknown as Repository
  ) {}

  // Signature
  public allow<
    Action extends string,
    SubjectType extends keyof SubjectTypeFilters,
  >(
    action: Action,
    subjectType: SubjectType
  ): RuleSet<
    SubjectTypeFilters,
    AddRule<
      SubjectTypeFilters,
      Repository,
      Action,
      SubjectType,
      LiteralFilter<SubjectTypeFilters[SubjectType]>
    >
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
    AddRule<
      SubjectTypeFilters,
      Repository,
      Action,
      SubjectType,
      LiteralFilter<Condition>
    >
  >;
  public allow<
    Action extends string,
    SubjectType extends keyof SubjectTypeFilters,
    Condition extends FunctionFilterCallback<
      any[],
      SubjectTypeFilters[SubjectType]
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
      FunctionFilter<Parameters<Condition>, SubjectTypeFilters[SubjectType]>
    >
  >;
  public allow<
    Action extends string,
    SubjectType extends keyof SubjectTypeFilters,
    Condition extends AbstractFilter<any[], SubjectTypeFilters[SubjectType]>,
  >(
    action: Action,
    subjectType: SubjectType,
    condition: Condition
  ): RuleSet<
    SubjectTypeFilters,
    AddRule<SubjectTypeFilters, Repository, Action, SubjectType, Condition>
  >;

  // Implementation
  public allow(action: any, subjectType: any, condition?: any): any {
    return this._addRule(false, action, subjectType, condition);
  }

  // Signature
  public forbid<
    Action extends string,
    SubjectType extends keyof SubjectTypeFilters,
  >(
    action: Action,
    subjectType: SubjectType
  ): RuleSet<
    SubjectTypeFilters,
    AddRule<
      SubjectTypeFilters,
      Repository,
      Action,
      SubjectType,
      LiteralFilter<SubjectTypeFilters[SubjectType]>
    >
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
    AddRule<
      SubjectTypeFilters,
      Repository,
      Action,
      SubjectType,
      LiteralFilter<Condition>
    >
  >;
  public forbid<
    Action extends string,
    SubjectType extends keyof SubjectTypeFilters,
    Condition extends FunctionFilterCallback<
      any[],
      SubjectTypeFilters[SubjectType]
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
      FunctionFilter<Parameters<Condition>, SubjectTypeFilters[SubjectType]>
    >
  >;
  public forbid<
    Action extends string,
    SubjectType extends keyof SubjectTypeFilters,
    Condition extends AbstractFilter<any[], SubjectTypeFilters[SubjectType]>,
  >(
    action: Action,
    subjectType: SubjectType,
    condition: Condition
  ): RuleSet<
    SubjectTypeFilters,
    AddRule<SubjectTypeFilters, Repository, Action, SubjectType, Condition>
  >;

  // Implementation
  public forbid(action: any, subjectType: any, condition?: any): any {
    return this._addRule(true, action, subjectType, condition);
  }

  // Signature/Implementation
  public async accessible<
    Action extends keyof Repository,
    SubjectType extends keyof Repository[Action] & keyof SubjectTypeFilters,
    CurrentRule extends Repository[Action][SubjectType] &
      Rule<AbstractFilter<any[], unknown>>,
    Args extends _RuleArgs<CurrentRule>,
  >(
    action: Action,
    subjectType: SubjectType,
    ...args: Args
  ): Promise<SubjectTypeFilters[SubjectType]> {
    const rule: CurrentRule = this.rules[action][subjectType] as any;
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

    const filterset = (await Promise.all(
      rule.filters.map(async (item) => {
        const filterGenerator = item as AbstractFilter<
          Args,
          SubjectTypeFilters[SubjectType]
        >;
        let filter = (await filterGenerator.getFilter(
          ...args
        )) as SubjectTypeFilters[SubjectType] | boolean;

        if (typeof filter !== "boolean") {
          if (filterGenerator.negate) {
            filter = this.queryEngine.negate(filter);
          }
          return filter;
        }

        if (filterGenerator.negate) {
          filter = !filter;
        }
        if (filter) {
          return this.queryEngine.all();
        } else {
          return this.queryEngine.none();
        }
      })
    )) as SubjectTypeFilters[SubjectType][];

    return this.queryEngine.and(...filterset);
  }

  /*
  FIXME: HAVE NOT DECIDED HOW THESE MUST WORK.
  public can(action: A, subjectType: T) {}
  public cannot(action: A, subjectType: T) {}
  */

  // Private methods
  private _addRule(
    negate: boolean,
    action: any,
    subjectType: any,
    condition?: any
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
    (this as any).rules[action] = (this as any).rules[action] ?? {};
    (this as any).rules[action][subjectType] =
      (this as any).rules[action][subjectType] ?? new Rule();
    const rule: Rule<any> = (this as any).rules[action][subjectType];
    rule.filters.push(condition);
    return this;
  }
}

class Rule<FilterType extends AbstractFilter<any[], unknown>> {
  constructor(public filters: FilterType[] = []) {}
}

type Awaitable<T> = T | Promise<T>;
type FunctionFilterCallback<Args extends any[], Filter> = (
  ...args: Args
) => Awaitable<Filter | boolean>;

/**
 * Convert from all possible condition types to abstract filter.
 */
type ToAbstractFilter<
  Filter,
  Condition extends
    | FunctionFilterCallback<any[], Filter>
    | Filter
    | boolean
    | AbstractFilter<any[], Filter>
    | undefined,
> = [Condition] extends [undefined]
  ? LiteralFilter<Filter>
  : Condition extends AbstractFilter<any[], Filter>
    ? Condition
    : Condition extends boolean
      ? LiteralFilter<Filter>
      : Condition extends Filter
        ? LiteralFilter<Filter>
        : Condition extends FunctionFilterCallback<any[], Filter>
          ? FunctionFilter<Parameters<Condition>, Filter>
          : never;

/**
 * Add a rule to the ruleset.
 */
type AddRule<
  SubjectTypeFilters extends {},
  Repository extends {},
  Action extends string,
  SubjectType extends keyof SubjectTypeFilters,
  Condition extends AbstractFilter<any[], unknown>,
  _RuleType = _AddRule_1<
    SubjectTypeFilters,
    Action extends keyof Repository
      ? Repository[Action] extends {}
        ? Repository[Action]
        : never
      : {},
    SubjectType,
    Condition
  >,
> = [_RuleType] extends [never]
  ? never
  : Omit<Repository, SubjectType> & {
      [key in Action]: _RuleType;
    };

/**
 * Set the compounded abstract filter at the second level.
 */
type _AddRule_1<
  SubjectTypeFilters extends {},
  ActionRepository extends {},
  SubjectType extends keyof SubjectTypeFilters,
  Condition extends AbstractFilter<any[], unknown>,
  _FilterType extends AbstractFilter<any[], unknown> = _AddRule_2<
    SubjectType extends keyof ActionRepository
      ? ActionRepository[SubjectType] extends Rule<
          infer _ExistingRuleFilterType
        >
        ? _ExistingRuleFilterType
        : never
      : Condition,
    Condition
  >,
> = [_FilterType] extends [never]
  ? never
  : Omit<ActionRepository, SubjectType> & {
      [key in SubjectType]: Rule<_FilterType>;
    };

/**
 * Create an AbstractFilter by compounding the existing types.
 */
type _AddRule_2<
  Existing extends AbstractFilter<any[], unknown>,
  Condition extends AbstractFilter<any[], unknown>,
  _CompoundArgs extends any[] = _AddRule_3<Existing, Condition>,
  _InferredFilter = _AddRule_4<Existing, Condition>,
> = [_InferredFilter] extends [never]
  ? never
  : [_CompoundArgs] extends [never]
    ? never
    : AbstractFilter<_CompoundArgs, _InferredFilter>;

/**
 * Pick the largest argument type that is still compatible with both the existing
 * and the new condition.
 */
type _AddRule_3<
  Existing extends AbstractFilter<any[], unknown>,
  Condition extends AbstractFilter<any[], unknown>,
  _ExistingArgs extends any[] = _AbstractFilterArgsType<Existing>,
  _ConditionArgs extends any[] = _AbstractFilterArgsType<Condition>,
> = _ExistingArgs extends [..._ConditionArgs, ...any[]]
  ? _ExistingArgs
  : _ConditionArgs extends [..._ExistingArgs, ...any[]]
    ? _ConditionArgs
    : never;

/**
 * If both filter types match, return that. Otherwise the type is invalid.
 */
type _AddRule_4<
  Existing extends AbstractFilter<any[], unknown>,
  Condition extends AbstractFilter<any[], unknown>,
  _InferredExistingFilter = _AbstractFilterFilterType<Existing>,
  _InferredConditionFilter = _AbstractFilterFilterType<Condition>,
> = _InferredExistingFilter extends _InferredConditionFilter
  ? _InferredConditionFilter extends _InferredExistingFilter
    ? _InferredExistingFilter
    : never
  : never;

type _AbstractFilterFilterType<F> =
  F extends AbstractFilter<any[], infer Filter> ? Filter : never;
type _AbstractFilterArgsType<F> =
  F extends AbstractFilter<infer Args, unknown> ? Args : never;
type _RuleArgs<R> =
  R extends Rule<AbstractFilter<infer Args, unknown>> ? Args : never;

abstract class QueryEngine<SubjectTypeFilters extends {}> {
  abstract all<
    SubjectType extends keyof SubjectTypeFilters,
  >(): SubjectTypeFilters[SubjectType];
  abstract none<
    SubjectType extends keyof SubjectTypeFilters,
  >(): SubjectTypeFilters[SubjectType];
  abstract and<SubjectType extends keyof SubjectTypeFilters>(
    ...terms: SubjectTypeFilters[SubjectType][]
  ): SubjectTypeFilters[SubjectType];
  abstract negate<SubjectType extends keyof SubjectTypeFilters>(
    condition: SubjectTypeFilters[SubjectType]
  ): SubjectTypeFilters[SubjectType];
}

abstract class AbstractFilter<Args extends any[], Filter> {
  constructor(public negate: boolean) {}

  abstract getFilter: FunctionFilterCallback<Args, Filter>;
}

class LiteralFilter<Filter> extends AbstractFilter<any[], Filter> {
  constructor(
    negate: boolean,
    private filter: Filter | boolean
  ) {
    super(negate);
  }

  getFilter = () => {
    return this.filter;
  };
}

class FunctionFilter<Args extends any[], Filter> extends AbstractFilter<
  Args,
  Filter
> {
  constructor(
    negate: boolean,
    private fn: FunctionFilterCallback<Args, Filter>
  ) {
    super(negate);
  }

  getFilter: FunctionFilterCallback<Args, Filter> = (...args) => {
    return this.fn(...args);
  };
}

type Test_SubjectTypeFilters = {
  posts: number;
  comments: {
    first: number;
    second?: number;
  };
};

const rules = new RuleSet({} as any as QueryEngine<Test_SubjectTypeFilters>)
  .allow("read", "posts")
  .forbid("create", "comments", { first: 100 })
  .accessible("read", "posts");
