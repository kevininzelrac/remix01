// FIXME: Test types using tsd
module "@app/authorization" {
  class RuleSet<
    SubjectTypeFilters extends {},
    Repository extends {
      [Action in string]?: {
        [SubjectType in keyof SubjectTypeFilters]?: Rule<
          AbstractFilter<any[], Awaitable<SubjectTypeFilters[SubjectType]>>
        >;
      };
    } = {},
  > {
    public static new<STF extends {}>(
      queryEngine: QueryEngine<STF>
    ): RuleSet<STF, {}> {
      return new RuleSet(queryEngine, {});
    }

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
      Condition extends PromiseFunctionFilterCallback<
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
        FunctionFilter<
          Parameters<Condition>,
          Promise<SubjectTypeFilters[SubjectType]>
        >
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
      Condition extends PromiseFunctionFilterCallback<
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
        FunctionFilter<
          Parameters<Condition>,
          Promise<SubjectTypeFilters[SubjectType]>
        >
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

    public accessible<
      Action extends keyof Repository,
      SubjectType extends keyof Repository[Action] & keyof SubjectTypeFilters,
      Args extends RuleArgs<Repository[Action][SubjectType]>,
      Filter extends RuleFilter<Repository[Action][SubjectType]> &
        SubjectTypeFilters[SubjectType],
    >(action: Action, subjectType: SubjectType, ...args: Args): Filter;

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
  type FunctionFilterCallback<Args extends any[], Filter> = (
    ...args: Args
  ) => Filter | boolean;
  type PromiseFunctionFilterCallback<Args extends any[], Filter> = (
    ...args: Args
  ) => Promise<Filter | boolean>;

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
    _InferredExistingFilter = _UnwrapPromise<_AbstractFilterFilterType<Existing>>,
    _InferredConditionFilter = _UnwrapPromise<
      _AbstractFilterFilterType<Condition>
    >,
    _InferredFilter = _InferredExistingFilter extends _InferredConditionFilter
      ? _InferredConditionFilter extends _InferredExistingFilter
        ? _InferredExistingFilter
        : never
      : never,
  > = [_InferredFilter] extends [never]
    ? never
    : _AbstractFilterFilterType<Existing> extends Promise<any>
      ? Promise<_InferredFilter>
      : _AbstractFilterFilterType<Condition> extends Promise<any>
        ? Promise<_InferredFilter>
        : _InferredFilter;

  type _UnwrapPromise<T> = T extends Promise<infer V> ? V : T;
  type _AbstractFilterFilterType<F> =
    F extends AbstractFilter<any[], infer Filter> ? Filter : never;
  type _AbstractFilterArgsType<F> =
    F extends AbstractFilter<infer Args, unknown> ? Args : never;
  type RuleArgs<R> =
    R extends Rule<AbstractFilter<infer Args, unknown>> ? Args : never;
  type RuleFilter<R> =
    R extends Rule<AbstractFilter<any[], infer Filter>> ? Filter : never;

  abstract class QueryEngine<SubjectTypeFilters extends {}> {
    abstract all<SubjectType extends keyof SubjectTypeFilters>(
      subjectType: SubjectType
    ): SubjectTypeFilters[SubjectType];
    abstract none<SubjectType extends keyof SubjectTypeFilters>(
      subjectType: SubjectType
    ): SubjectTypeFilters[SubjectType];
    abstract and<SubjectType extends keyof SubjectTypeFilters>(
      subjectType: SubjectType,
      ...terms: SubjectTypeFilters[SubjectType][]
    ): SubjectTypeFilters[SubjectType];
    abstract negate<SubjectType extends keyof SubjectTypeFilters>(
      subjectType: SubjectType,
      condition: SubjectTypeFilters[SubjectType]
    ): SubjectTypeFilters[SubjectType];
  }

  abstract class AbstractFilter<Args extends any[], Filter> {
    constructor(public negate: boolean) {}

    abstract getFilter:
      | FunctionFilterCallback<Args, Filter>
      | PromiseFunctionFilterCallback<Args, Filter>;
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
      private fn:
        | FunctionFilterCallback<Args, Filter>
        | PromiseFunctionFilterCallback<Args, Filter>
    ) {
      super(negate);
    }

    getFilter:
      | FunctionFilterCallback<Args, Filter>
      | PromiseFunctionFilterCallback<Args, Filter> = (...args) => {
      return this.fn(...args) as any;
    };
  }
}
