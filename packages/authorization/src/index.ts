class RuleSet<Repository extends {} = {}> {
  constructor(private rules: Repository = {} as unknown as Repository) {}

  /* Signature */
  public allow<Action extends string, SubjectType extends string, Filter>(
    action: Action,
    subjectType: SubjectType
  ): AddRule<Repository, Action, SubjectType, BooleanFilter<Filter>>;
  public allow<
    Action extends string,
    SubjectType extends string,
    Condition extends AbstractFilter<unknown[], unknown>,
  >(
    action: Action,
    subjectType: SubjectType,
    condition: Condition
  ): AddRule<Repository, Action, SubjectType, Condition>;

  /* Implementation */
  public allow<
    Action extends string,
    SubjectType extends string,
    Condition extends AbstractFilter<unknown[], unknown>,
  >(
    action: Action,
    subjectType: SubjectType,
    condition?: Condition
  ): AddRule<Repository, Action, SubjectType, Condition> {
    if (condition === undefined) {
      condition = new BooleanFilter(true) as any;
    }
    const newThis = this as any;
    if (!(action in newThis.rules)) {
      newThis[action] = {};
    }
    if (!(subjectType in newThis.rules[action])) {
      newThis[action][subjectType] = [];
    }
    newThis[action][subjectType].push(condition);
    return newThis;
  }

  /* Signature */
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

  /* Implementation */
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

  /*
  public can<A extends keyof R, T extends keyof R[A]>(action: A, subjectType: T) {}

  public cannot(action: A, subjectType: T) {}

  public accessible(action: A, subjectType: T): F {}
  */
}

type ElementType<T> = T extends Array<infer U> ? U : never;
type Awaitable<T> = T | Promise<T>;

/**
 * Add a rule to the ruleset.
 */
type AddRule<
  Repository extends {},
  Action extends string,
  SubjectType extends string,
  Condition extends AbstractFilter<unknown[], unknown>,
  _RuleType = _AddRule_1<
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
  : Omit<Repository, Action> & {
      [key in Action]: _RuleType;
    };

/**
 * Set the compounded abstract filter at the second level.
 */
type _AddRule_1<
  RepositoryAction extends {},
  SubjectType extends string,
  Condition extends AbstractFilter<unknown[], unknown>,
  _FilterType = _AddRule_2<
    SubjectType extends keyof RepositoryAction
      ? ElementType<RepositoryAction[SubjectType]> extends AbstractFilter<
          unknown[],
          unknown
        >
        ? ElementType<RepositoryAction[SubjectType]>
        : never
      : Condition,
    Condition
  >,
> = [_FilterType] extends [never]
  ? never
  : Omit<RepositoryAction, SubjectType> & {
      [key in SubjectType]: _FilterType[];
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
> = _ExistingArgs extends [..._ConditionArgs, ...any[]]
  ? _ExistingArgs
  : _ConditionArgs extends [..._ExistingArgs, ...any[]]
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
type _ToCondition<V> = V extends (...args: any[]) => any
  ? FunctionFilter<Parameters<V>, _UnwrapAwaitable<ReturnType<V>>>
  // If exactly undefined
  : [V] extends [undefined]
    ? undefined extends V
      ? BooleanFilter<unknown>
      : LiteralFilter<V>
    : LiteralFilter<V>;
type _UnwrapAwaitable<T> = T extends Promise<infer I> ? I : T;

type Test_1 = {};
type Test_2 = AddRule<Test_1, "read", "Post", AbstractFilter<[], string>>;
type Test_3 = AddRule<Test_2, "read", "Post", AbstractFilter<[string], string>>;

function main() {
  const test: Test_3 = {} as any;
  const filter = test.read.Post[0];
}

interface QueryEngine {
  and<Filter>(filters: Filter[]): Filter;
  negate<Filter>(filter: Filter): Filter;
}

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

const rules = new RuleSet();
