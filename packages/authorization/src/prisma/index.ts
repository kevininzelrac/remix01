import { QueryEngine } from "../QueryEngine";

type PrismaSubject = {
  fields: { [fieldName in string]?: any };
  findMany: (args: { where?: any }) => any;
};

type StripNeverKeys<T extends {}> = Pick<
  T,
  { [K in keyof T]: [T[K]] extends [never] ? never : K }[keyof T]
>;

type GetSubjectTypeFilters<T extends {}> = StripNeverKeys<{
  [K in keyof T]: T[K] extends PrismaSubject
    ? NonNullable<Parameters<T[K]["findMany"]>[0]["where"]>
    : never;
}>;

export class PrismaQueryEngine<PrismaClient extends {}> extends QueryEngine<
  GetSubjectTypeFilters<PrismaClient>
> {
  constructor(private client: PrismaClient) {
    super();
  }

  all<SubjectType extends keyof GetSubjectTypeFilters<PrismaClient>>(
    _subjectType: SubjectType
  ): GetSubjectTypeFilters<PrismaClient>[SubjectType] {
    return {} as any; // Trust me;
  }
  none<SubjectType extends keyof GetSubjectTypeFilters<PrismaClient>>(
    subjectType: SubjectType
  ): GetSubjectTypeFilters<PrismaClient>[SubjectType] {
    const pickedColumn =
      "id" in (this.client[subjectType] as PrismaSubject).fields
        ? "id"
        : Object.keys((this.client[subjectType] as PrismaSubject).fields)[0];
    return {
      [pickedColumn]: {
        not: (this.client[subjectType] as PrismaSubject).fields[pickedColumn],
      },
    } as any; // Trust me
  }
  and<SubjectType extends keyof GetSubjectTypeFilters<PrismaClient>>(
    _subjectType: SubjectType,
    ...terms: GetSubjectTypeFilters<PrismaClient>[SubjectType][]
  ): GetSubjectTypeFilters<PrismaClient>[SubjectType] {
    return {
      AND: terms,
    } as any; // Trust me
  }
  negate<SubjectType extends keyof GetSubjectTypeFilters<PrismaClient>>(
    _subjectType: SubjectType,
    condition: GetSubjectTypeFilters<PrismaClient>[SubjectType]
  ): GetSubjectTypeFilters<PrismaClient>[SubjectType] {
    return {
      NOT: condition,
    } as any; // Trust me
  }
}
