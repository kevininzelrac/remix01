import { Rule } from "./Rule";
import { AbstractFilter } from "./filters/AbstractFilter";

type UnwrapPromise<T> = T extends Promise<infer V> ? V : T;
type AbstractFilterArgsType<F> =
  F extends AbstractFilter<infer Args, any> ? Args : never;
type AbstractFilterReturnType<F> =
  F extends AbstractFilter<any[], infer ReturnType> ? ReturnType : never;

export type RuleArgs<R> =
  R extends Rule<AbstractFilter<infer Args, any>> ? Args : never;
export type RuleReturnType<R> =
  R extends Rule<AbstractFilter<any[], infer ReturnType>> ? ReturnType : never;

export type FilterLiteralType<Filter> = boolean | Filter;
export type FilterPromiseType<Filter> = Promise<boolean> | Promise<Filter>;
export type FilterReturnType<Filter> =
  | FilterLiteralType<Filter>
  | FilterPromiseType<Filter>;

/**
 * Add a rule to the ruleset.
 */
export type AddRule<
  SubjectTypeFilters extends {},
  Repository extends {},
  Action extends string,
  SubjectType extends keyof SubjectTypeFilters,
  Condition extends AbstractFilter<
    any[],
    FilterReturnType<SubjectTypeFilters[SubjectType]>
  >,
  _RuleType = AddRule_1<
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
type AddRule_1<
  SubjectTypeFilters extends {},
  ActionRepository extends {},
  SubjectType extends keyof SubjectTypeFilters,
  Condition extends AbstractFilter<
    any[],
    FilterReturnType<SubjectTypeFilters[SubjectType]>
  >,
  _FilterType extends AbstractFilter<
    any[],
    FilterReturnType<SubjectTypeFilters[SubjectType]>
  > = AddRule_2<
    SubjectTypeFilters,
    SubjectType,
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
type AddRule_2<
  SubjectTypeFilters extends {},
  SubjectType extends keyof SubjectTypeFilters,
  Existing extends AbstractFilter<
    any[],
    FilterReturnType<SubjectTypeFilters[SubjectType]>
  >,
  Condition extends AbstractFilter<
    any[],
    FilterReturnType<SubjectTypeFilters[SubjectType]>
  >,
  _CompoundArgs extends any[] = AddRule_3<Existing, Condition>,
  _InferredFilter extends FilterReturnType<
    SubjectTypeFilters[SubjectType]
  > = AddRule_4<SubjectTypeFilters, SubjectType, Existing, Condition>,
> = [_InferredFilter] extends [never]
  ? never
  : [_CompoundArgs] extends [never]
    ? never
    : AbstractFilter<_CompoundArgs, _InferredFilter>;

/**
 * Pick the largest argument type that is still compatible with both the existing
 * and the new condition.
 */
type AddRule_3<
  Existing extends AbstractFilter<any[], any>,
  Condition extends AbstractFilter<any[], any>,
  _ExistingArgs extends any[] = AbstractFilterArgsType<Existing>,
  _ConditionArgs extends any[] = AbstractFilterArgsType<Condition>,
> = _ExistingArgs extends [..._ConditionArgs, ...any[]]
  ? _ExistingArgs
  : _ConditionArgs extends [..._ExistingArgs, ...any[]]
    ? _ConditionArgs
    : never;

/**
 * If both filter types match, return that. Otherwise the type is invalid.
 */
type AddRule_4<
  SubjectTypeFilters extends {},
  SubjectType extends keyof SubjectTypeFilters,
  Existing extends AbstractFilter<
    any[],
    FilterReturnType<SubjectTypeFilters[SubjectType]>
  >,
  Condition extends AbstractFilter<
    any[],
    FilterReturnType<SubjectTypeFilters[SubjectType]>
  >,
  _InferredExistingFilter extends FilterLiteralType<
    SubjectTypeFilters[SubjectType]
  > = UnwrapPromise<AbstractFilterReturnType<Existing>>,
  _InferredConditionFilter extends FilterLiteralType<
    SubjectTypeFilters[SubjectType]
  > = UnwrapPromise<AbstractFilterReturnType<Condition>>,
  _InferredFilter extends FilterLiteralType<
    SubjectTypeFilters[SubjectType]
  > = _InferredExistingFilter extends _InferredConditionFilter
    ? _InferredConditionFilter extends _InferredExistingFilter
      ? _InferredExistingFilter
      : never
    : never,
> = [_InferredFilter] extends [never]
  ? never
  : AbstractFilterReturnType<Existing> extends Promise<any>
    ? Promise<_InferredFilter>
    : AbstractFilterReturnType<Condition> extends Promise<any>
      ? Promise<_InferredFilter>
      : _InferredFilter;
