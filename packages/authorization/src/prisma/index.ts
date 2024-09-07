import { QueryEngine } from "../QueryEngine.js";

type PrismaSubject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: { [fieldName in string]?: any };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findMany: (args: { where?: any }) => any;
};

type StripNeverKeys<T extends object> = Pick<
  T,
  { [K in keyof T]: [T[K]] extends [never] ? never : K }[keyof T]
>;

type GetSubjectTypeFilters<T extends object> = StripNeverKeys<{
  [K in keyof T]: T[K] extends PrismaSubject
    ? NonNullable<Parameters<T[K]["findMany"]>[0]["where"]>
    : never;
}>;

export class PrismaQueryEngine<PrismaClient extends object> extends QueryEngine<
  GetSubjectTypeFilters<PrismaClient>
> {
  constructor(private client: PrismaClient) {
    super();
  }

  all<
    SubjectType extends keyof GetSubjectTypeFilters<PrismaClient>,
  >(): GetSubjectTypeFilters<PrismaClient>[SubjectType] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return {} as any; // Trust me;
  }
  none<SubjectType extends keyof GetSubjectTypeFilters<PrismaClient>>(
    subjectType: SubjectType,
  ): GetSubjectTypeFilters<PrismaClient>[SubjectType] {
    const pickedColumn =
      "id" in (this.client[subjectType] as PrismaSubject).fields
        ? "id"
        : Object.keys((this.client[subjectType] as PrismaSubject).fields)[0];
    return {
      [pickedColumn]: {
        not: (this.client[subjectType] as PrismaSubject).fields[pickedColumn],
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any; // Trust me
  }
  and<SubjectType extends keyof GetSubjectTypeFilters<PrismaClient>>(
    _subjectType: SubjectType,
    ...terms: GetSubjectTypeFilters<PrismaClient>[SubjectType][]
  ): GetSubjectTypeFilters<PrismaClient>[SubjectType] {
    return {
      AND: terms,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any; // Trust me
  }
  negate<SubjectType extends keyof GetSubjectTypeFilters<PrismaClient>>(
    _subjectType: SubjectType,
    condition: GetSubjectTypeFilters<PrismaClient>[SubjectType],
  ): GetSubjectTypeFilters<PrismaClient>[SubjectType] {
    return {
      NOT: condition,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any; // Trust me
  }
}
