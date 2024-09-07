import { QueryEngine } from "./index.js";
import { EvaluationContext } from "./filters/AbstractFilter.js";
import { BaseSubjectTypeFilters, FilterLiteralType } from "./types.js";

export class EvaluatedRule<
  SubjectTypeFilters extends BaseSubjectTypeFilters,
  SubjectType extends keyof SubjectTypeFilters,
> {
  private filters: FilterLiteralType<SubjectTypeFilters[SubjectType]>[];

  constructor(
    private subjectType: SubjectType,
    private queryEngine: QueryEngine<SubjectTypeFilters>,
    evaluationContexts: EvaluationContext<
      FilterLiteralType<SubjectTypeFilters[SubjectType]>
    >[],
  ) {
    this.filters = evaluationContexts.reduce(
      (acc, { negate, filter }) => {
        if (typeof filter === "boolean" && negate) {
          // forbid returns false
          if (!filter) {
            return acc;
          }
          filter = !filter;
        } else if (typeof filter !== "boolean" && negate) {
          filter = this.queryEngine.negate(subjectType, filter);
        }
        acc.push(filter);
        return acc;
      },
      [] as FilterLiteralType<SubjectTypeFilters[SubjectType]>[],
    );
  }

  public accessible(): SubjectTypeFilters[SubjectType] {
    const items = this.filters.map((filter) => {
      if (typeof filter === "boolean") {
        if (filter) {
          return this.queryEngine.all(this.subjectType);
        } else {
          return this.queryEngine.none(this.subjectType);
        }
      }

      return filter;
    });

    return this.queryEngine.and(this.subjectType, ...items);
  }

  public can(): boolean {
    let queryFound = false;
    for (const filter of this.filters) {
      if (filter === false) {
        return filter;
      }
      queryFound = true;
    }
    return queryFound;
  }

  public cannot(): boolean {
    return !this.can();
  }
}
