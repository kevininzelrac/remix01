export abstract class QueryEngine<SubjectTypeFilters extends {}> {
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
