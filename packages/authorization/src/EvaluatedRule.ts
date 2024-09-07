import { QueryEngine } from "~/index.js";
import { EvaluationContext } from "~/filters/AbstractFilter.js";
import { BaseSubjectTypeFilters, FilterLiteralType } from "~/types.js";

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
    this.filters = evaluationContexts.map(({ negate, filter }) => {
      if (typeof filter === "boolean") {
        if (negate) {
          return !filter;
        }
        return filter;
      }
      if (negate) {
        return this.queryEngine.negate(subjectType, filter);
      }
      return filter;
    });
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
      if (typeof filter === "boolean") {
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
