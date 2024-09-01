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
    Condition extends (
      ...args: unknown[]
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
    Condition extends AbstractFilter<
      unknown[],
      SubjectTypeFilters[SubjectType]
    >,
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

  /*
  // Signature
  public forbid<Action extends string, SubjectType extends string, Filter>(
    action: Action,
    subjectType: SubjectType
  ): AddRule<Repository, Action, SubjectType, BooleanFilter<Filter>>;
  public forbid<
    Action extends string,
    SubjectType extends string,
    Condition extends AbstractFilter<unknown[], unknown>,
  >(
    action: Action,
    subjectType: SubjectType,
    condition: Condition
  ): AddRule<Repository, Action, SubjectType, Condition>;

  // Implementation
  public forbid<
    Action extends string,
    SubjectType extends string,
    Condition extends AbstractFilter<unknown[], unknown>,
  >(
    action: Action,
    subjectType: SubjectType,
    condition?: Condition
  ): AddRule<Repository, Action, SubjectType, Condition> {
    throw new Error("Not implemented.");
  }

  public can<A extends keyof R, T extends keyof R[A]>(action: A, subjectType: T) {}

  public cannot(action: A, subjectType: T) {}

  public accessible(action: A, subjectType: T): F {}
  */
}

class Rule<FilterType extends AbstractFilter<unknown[], unknown>> {
  constructor(public filters: FilterType[] = []) {}
}

type Awaitable<T> = T | Promise<T>;

/**
 * Convert from all possible condition types to abstract filter.
 */
type ToAbstractFilter<
  Filter,
  Condition extends
    | ((...args: unknown[]) => Awaitable<Filter>)
    | Filter
    | AbstractFilter<unknown[], Filter>
    | undefined,
> = [Condition] extends [undefined]
  ? BooleanFilter<Filter>
  : Condition extends AbstractFilter<unknown[], Filter>
    ? Condition
    : Condition extends Filter
      ? AbstractFilter<[], Filter>
      : Condition extends (...args: unknown[]) => Awaitable<Filter>
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
  Condition extends AbstractFilter<unknown[], unknown>,
  _RuleType = _AddRule_1<
    SubjectType extends keyof Repository
      ? Repository[SubjectType] extends {}
        ? Repository[SubjectType]
        : never
      : {},
    Action,
    Condition
  >,
> = [_RuleType] extends [never]
  ? never
  : Omit<Repository, SubjectType> & {
      [key in SubjectType]: _RuleType;
    };

/**
 * Set the compounded abstract filter at the second level.
 */
type _AddRule_1<
  SubjectTypeRepository extends {},
  Action extends string,
  Condition extends AbstractFilter<unknown[], unknown>,
  _FilterType extends AbstractFilter<unknown[], unknown> = _AddRule_2<
    Action extends keyof SubjectTypeRepository
      ? SubjectTypeRepository[Action] extends Rule<
          infer _ExistingRuleFilterType
        >
        ? _ExistingRuleFilterType
        : never
      : Condition,
    Condition
  >,
> = [_FilterType] extends [never]
  ? never
  : Omit<SubjectTypeRepository, Action> & {
      [key in Action]: Rule<_FilterType>;
    };

/**
 * Create an AbstractFilter by compounding the existing types.
 */
type _AddRule_2<
  Existing extends AbstractFilter<unknown[], unknown>,
  Condition extends AbstractFilter<unknown[], unknown>,
  _CompoundArgs extends unknown[] = _AddRule_3<Existing, Condition>,
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
  Existing extends AbstractFilter<unknown[], unknown>,
  Condition extends AbstractFilter<unknown[], unknown>,
  _ExistingArgs extends unknown[] = _AbstractFilterArgsType<Existing>,
  _ConditionArgs extends unknown[] = _AbstractFilterArgsType<Condition>,
> = _ExistingArgs extends [..._ConditionArgs, ...unknown[]]
  ? _ExistingArgs
  : _ConditionArgs extends [..._ExistingArgs, ...unknown[]]
    ? _ConditionArgs
    : never;

/**
 * If both filter types match, return that. Otherwise the type is invalid.
 */
type _AddRule_4<
  Existing extends AbstractFilter<unknown[], unknown>,
  Condition extends AbstractFilter<unknown[], unknown>,
  _InferredExistingFilter = _AbstractFilterFilterType<Existing>,
  _InferredConditionFilter = _AbstractFilterFilterType<Condition>,
> = _InferredExistingFilter extends _InferredConditionFilter
  ? _InferredConditionFilter extends _InferredExistingFilter
    ? _InferredExistingFilter
    : never
  : never;

type _AbstractFilterFilterType<F> =
  F extends AbstractFilter<unknown[], infer Filter> ? Filter : never;
type _AbstractFilterArgsType<F> =
  F extends AbstractFilter<infer Args, unknown> ? Args : never;

interface QueryEngine<SubjectTypeFilters extends {}> {}

abstract class AbstractFilter<Args extends unknown[], Filter> {
  abstract getFilter(...args: Args): Awaitable<Filter>;
}

class BooleanFilter<Filter> extends AbstractFilter<unknown[], Filter> {
  constructor(private flag: boolean) {
    super();
  }

  getFilter(): Filter {
    throw new Error("Not implemented");
  }
}

class LiteralFilter<Filter> extends AbstractFilter<unknown[], Filter> {
  constructor(private filter: Filter) {
    super();
  }

  getFilter(): Filter {
    return this.filter;
  }
}

class FunctionFilter<Args extends unknown[], Filter> extends AbstractFilter<
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
  comments: string;
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

const queryEngine = new PrismaQueryEngine();
const rules = new RuleSet(
  queryEngine as any as QueryEngine<Test_SubjectTypeFilters>
).allow();
