import { QueryEngine } from "..";

type SubsetOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

type PickByType<T, U> = Pick<T, SubsetOfType<T, U>>;

type PrismaWhereCondition = {
  NOT?: any;
  AND?: any[];
  OR?: any[];
};

type PrismaSubject = {
  fields: { [fieldName in string]?: any };
  findMany: (args: { where?: any }) => any;
};

type BasePrismaClient = {
  [SubjectType in string]?: PrismaSubject;
};

type GetSubjectTypeFilters<PrismaClient extends {}> =
  PrismaClient extends BasePrismaClient
    ? {
        [SubjectType in keyof PrismaClient]: "findMany" extends keyof PrismaClient[SubjectType]
          ? PrismaClient[SubjectType]["findMany"] extends (
              ...args: any[]
            ) => any
            ? NonNullable<
                Extract<
                  Parameters<PrismaClient[SubjectType]["findMany"]>[0],
                  { where?: any }
                >["where"]
              >
            : never
          : never;
      }
    : never;

export class PrismaQueryEngine<PrismaClient extends {}> extends QueryEngine<
  GetSubjectTypeFilters<PickByType<PrismaClient, PrismaSubject>>
> {
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
    } as any; // Trust me;
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

type CredentialWhere = {
  NOT?: CredentialWhere;
  AND?: CredentialWhere[];
  OR?: CredentialWhere[];
  id: number;
};

class TestPrismaClient {
  get credential(): {
    fields: {};
    findMany(arg: { where?: CredentialWhere }): any[];
  } {
    throw new Error();
  }
}

const testPrismaClient = {
  credential: {
    fields: {},
    findMany(arg: { where?: CredentialWhere }): any[] {
      return [];
    },
  },
  somethingElse: 100,
};

const prismaEngine = new PrismaQueryEngine(testPrismaClient);
type Test1 = typeof prismaEngine extends PrismaQueryEngine<infer T> ? T : never;
type Test2 = typeof prismaEngine extends QueryEngine<infer T> ? T : never;

type Test3 = GetSubjectTypeFilters<PickByType<Test1, PrismaSubject>>;
type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
type Test4 = Expand<Test2>;
