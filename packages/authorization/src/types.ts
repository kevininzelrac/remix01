import { Rule } from "./Rule.js";
import { AbstractFilter } from "./filters/AbstractFilter.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NotPromise<T> = T extends Promise<any> ? never : T;
export type AbstractFilterArgsType<F> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  F extends AbstractFilter<infer Args, any> ? Args : never;
export type AbstractFilterReturnType<F> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  F extends AbstractFilter<any[], infer ReturnType> ? ReturnType : never;

export type RuleArgs<R> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  R extends Rule<any, any, infer Args, any> ? Args : never;
export type RuleIsPromise<R> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  R extends Rule<any, any, any, infer IsPromise> ? IsPromise : never;

export type FilterLiteralType<Filter> = boolean | Filter;
export type FilterReturnType<Filter> =
  | FilterLiteralType<Filter>
  | Promise<boolean>
  | Promise<Filter>;

export type BaseSubjectTypeFilters = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in string]?: NonNullable<NotPromise<any>>;
};
export type BaseRepository<SubjectTypeFilters extends BaseSubjectTypeFilters> =
  {
    [Action in string]?: {
      [SubjectType in keyof SubjectTypeFilters]?: Rule<
        SubjectTypeFilters,
        SubjectType,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any[],
        boolean
      >;
    };
  };

/**
 * Add a rule to the ruleset.
 */
export type AddRule<
  SubjectTypeFilters extends BaseSubjectTypeFilters,
  Repository extends BaseRepository<BaseSubjectTypeFilters>,
  Action extends string,
  SubjectType extends keyof SubjectTypeFilters,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Args extends any[],
  IsPromise extends boolean,
  // Implementation details
  _CurrentRule extends Rule<
    SubjectTypeFilters,
    SubjectType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  > = GetRule<SubjectTypeFilters, Repository, Action, SubjectType>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _CurrentRuleArgs extends any[] = RuleArgs<_CurrentRule>,
  _CurrentRuleIsPromise extends boolean = RuleIsPromise<_CurrentRule>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _CompoundArgs extends any[] = GetCompoundArgs<_CurrentRuleArgs, Args>,
  _CompoundIsPromise extends boolean = GetCompoundIsPromise<
    _CurrentRuleIsPromise,
    IsPromise
  >,
> = [_CompoundArgs] extends [never]
  ? never
  : [_CompoundIsPromise] extends [never]
    ? never
    : Omit<Repository, Action> & {
        [key in Action]: Omit<
          // eslint-disable-next-line @typescript-eslint/no-empty-object-type
          Action extends keyof Repository ? Repository[Action] : {},
          SubjectType
        > & {
          [key in SubjectType]: Rule<
            SubjectTypeFilters,
            SubjectType,
            _CompoundArgs,
            _CompoundIsPromise
          >;
        };
      };

/**
 * Get existing rule type on repository. Otherwise return default rule type.
 */
type GetRule<
  SubjectTypeFilters extends BaseSubjectTypeFilters,
  Repository extends BaseRepository<BaseSubjectTypeFilters>,
  Action extends string,
  SubjectType extends keyof SubjectTypeFilters,
> = Action extends keyof Repository
  ? SubjectType extends keyof Repository[Action]
    ? Repository[Action][SubjectType] extends Rule<
        SubjectTypeFilters,
        SubjectType,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any[],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any
      >
      ? Repository[Action][SubjectType]
      : Rule<SubjectTypeFilters, SubjectType>
    : Rule<SubjectTypeFilters, SubjectType>
  : Rule<SubjectTypeFilters, SubjectType>;

/**
 * Pick the largest argument type that is still compatible with both the existing
 * and the new condition.
 */
type GetCompoundArgs<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ExistingArgs extends any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  IncomingArgs extends any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = ExistingArgs extends [...IncomingArgs, ...any[]]
  ? ExistingArgs
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    IncomingArgs extends [...ExistingArgs, ...any[]]
    ? IncomingArgs
    : never;

/**
 * Only `false` doesn't `true`. Therefore the union will keep the condition
 * false until one value of `IncomingIsPromise` is `true`.
 */
type GetCompoundIsPromise<
  ExistingIsPromise extends boolean,
  IncomingIsPromise extends boolean,
> = ExistingIsPromise extends true
  ? true
  : IncomingIsPromise extends true
    ? true
    : false;
