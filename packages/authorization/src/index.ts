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
      BooleanFilter<SubjectTypeFilters[SubjectType]>
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
    Condition extends (
      ...args: any[]
    ) => Awaitable<SubjectTypeFilters[SubjectType]>,
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
    if (!(condition instanceof AbstractFilter)) {
      if (typeof condition === undefined) {
        condition = new BooleanFilter(true);
      } else if (typeof condition === "function") {
        condition = new FunctionFilter(condition);
      } else {
        condition = new LiteralFilter(condition);
      }
    }
    if (!(subjectType in this.rules)) {
      (this as any).rules[subjectType] = {};
    }
    if (!(action in (this as any).rules[subjectType])) {
      (this as any).rules[subjectType][action] = new Rule();
    }
    const rule: Rule<any> = (this as any).rules[subjectType][action];
    rule.filters.push(condition);
    return this;
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
      BooleanFilter<SubjectTypeFilters[SubjectType]>
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
    Condition extends (
      ...args: any[]
    ) => Awaitable<SubjectTypeFilters[SubjectType]>,
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
    throw new Error("Not implemented.");
  }

  // Signature/Implementation
  public accessible<
    Action extends keyof Repository,
    SubjectType extends keyof Repository[Action] & keyof SubjectTypeFilters,
  >(
    action: Action,
    subjectType: SubjectType
  ): Awaitable<SubjectTypeFilters[SubjectType]> {
    throw new Error("Not implemented.");
  }

  /*
  FIXME: HAVE NOT DECIDED HOW THESE MUST WORK.
  public can(action: A, subjectType: T) {}
  public cannot(action: A, subjectType: T) {}
  */
}

class Rule<FilterType extends AbstractFilter<any[], unknown>> {
  constructor(public filters: FilterType[] = []) {}
}

type Awaitable<T> = T | Promise<T>;

/**
 * Convert from all possible condition types to abstract filter.
 */
type ToAbstractFilter<
  Filter,
  Condition extends
    | ((...args: any[]) => Awaitable<Filter>)
    | Filter
    | AbstractFilter<any[], Filter>
    | undefined,
> = [Condition] extends [undefined]
  ? BooleanFilter<Filter>
  : Condition extends AbstractFilter<any[], Filter>
    ? Condition
    : Condition extends Filter
      ? AbstractFilter<[], Filter>
      : Condition extends (...args: any[]) => Awaitable<Filter>
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

interface QueryEngine<SubjectTypeFilters extends {}> {}

abstract class AbstractFilter<Args extends any[], Filter> {
  abstract getFilter(...args: Args): Awaitable<Filter>;
}

class BooleanFilter<Filter> extends AbstractFilter<any[], Filter> {
  constructor(private flag: boolean) {
    super();
  }

  getFilter(): Filter {
    throw new Error("Not implemented");
  }
}

class LiteralFilter<Filter> extends AbstractFilter<any[], Filter> {
  constructor(private filter: Filter) {
    super();
  }

  getFilter(): Filter {
    return this.filter;
  }
}

class FunctionFilter<Args extends any[], Filter> extends AbstractFilter<
  Args,
  Filter
> {
  constructor(private fn: (...args: Args) => Awaitable<Filter>) {
    super();
  }

  getFilter(...args: Args): Awaitable<Filter> {
    return this.fn(...args);
  }
}

type Test_SubjectTypeFilters = {
  posts: number;
  comments: {
    first: number;
    second?: number;
  };
};
type Test_1 = {};
type Test_2 = AddRule<
  Test_SubjectTypeFilters,
  Test_1,
  "read",
  "posts",
  AbstractFilter<[], number>
>;
type Test_3 = AddRule<
  Test_SubjectTypeFilters,
  Test_2,
  "read",
  "posts",
  AbstractFilter<[string, number], number>
>;

function main() {
  const test: Test_3 = {} as any;
  const filter = test.posts.read.filters[0];
}

const rules = new RuleSet({} as any as QueryEngine<Test_SubjectTypeFilters>)
  .allow("read", "posts")
  .forbid("create", "comments", { first: 100 })
  .accessible("read", "posts");
