import { QueryEngine } from "..";

type BasePrismaClient<T extends string> = {
  [SubjectType in T]?: {
    fields: { [fieldName in string]?: any };
    findMany: (args: { where?: any }) => any;
  };
};

type GetSubjectTypeFilters<PrismaClient extends BasePrismaClient<never>> = {
  [SubjectType in keyof PrismaClient]: "findMany" extends keyof PrismaClient[SubjectType]
    ? PrismaClient[SubjectType]["findMany"] extends (...args: any[]) => any
      ? Extract<
          Parameters<PrismaClient[SubjectType]["findMany"]>[0],
          { where?: any }
        >["where"]
      : never
    : never;
};

export class PrismaQueryEngine<
  PrismaClient extends BasePrismaClient<never>,
> extends QueryEngine<GetSubjectTypeFilters<PrismaClient>> {
  constructor(private client: PrismaClient) {
    super();
  }

  all<SubjectType extends keyof GetSubjectTypeFilters<PrismaClient>>(
    subjectType: SubjectType
  ): GetSubjectTypeFilters<PrismaClient>[SubjectType] {
    const pickedColumn =
      "id" in this.client[subjectType]!.fields
        ? "id"
        : Object.keys(this.client[subjectType]!.fields)[0];
    return {
      [pickedColumn]: {
        equals: this.client[subjectType]!.fields[pickedColumn],
      },
    };
  }
  none<SubjectType extends keyof GetSubjectTypeFilters<PrismaClient>>(
    subjectType: SubjectType
  ): GetSubjectTypeFilters<PrismaClient>[SubjectType] {
    const pickedColumn =
      "id" in this.client[subjectType]!.fields
        ? "id"
        : Object.keys(this.client[subjectType]!.fields)[0];
    return {
      [pickedColumn]: {
        not: this.client[subjectType]!.fields[pickedColumn],
      },
    };
  }
  and<SubjectType extends keyof GetSubjectTypeFilters<PrismaClient>>(
    _subjectType: SubjectType,
    ...terms: GetSubjectTypeFilters<PrismaClient>[SubjectType][]
  ): GetSubjectTypeFilters<PrismaClient>[SubjectType] {
    return {
      AND: terms,
    };
  }
  negate<SubjectType extends keyof GetSubjectTypeFilters<PrismaClient>>(
    _subjectType: SubjectType,
    condition: GetSubjectTypeFilters<PrismaClient>[SubjectType]
  ): GetSubjectTypeFilters<PrismaClient>[SubjectType] {
    return {
      NOT: condition,
    };
  }
}

class TestPrismaClient {
  get credential(): {
    fields: {};
    findMany(arg: { where?: { id: number } }): any[];
  } {
    throw new Error();
  }
}
