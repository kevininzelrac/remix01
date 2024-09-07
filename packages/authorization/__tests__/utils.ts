import { QueryEngine } from "../src/QueryEngine.js";

type PostsWhereInput =
  | boolean
  | {
      id?: string;
      title?: string;
      author?: string;
    }
  | { NOT: PostsWhereInput }
  | { AND: PostsWhereInput[] };

type UsersWhereInput =
  | boolean
  | {
      id?: number;
      name?: string;
      email?: string;
    }
  | { NOT: UsersWhereInput }
  | { AND: UsersWhereInput[] };

export type SubjectTypeFilters = {
  posts: PostsWhereInput;
  users: UsersWhereInput;
};

export class MockQueryEngine extends QueryEngine<SubjectTypeFilters> {
  all<SubjectType extends "posts" | "users">(): {
    posts: PostsWhereInput;
    users: UsersWhereInput;
  }[SubjectType] {
    return true;
  }
  none<SubjectType extends "posts" | "users">(): {
    posts: PostsWhereInput;
    users: UsersWhereInput;
  }[SubjectType] {
    return false;
  }
  and<SubjectType extends "posts" | "users">(
    _subjectType: SubjectType,
    ...terms: { posts: PostsWhereInput; users: UsersWhereInput }[SubjectType][]
  ): { posts: PostsWhereInput; users: UsersWhereInput }[SubjectType] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { AND: terms } as any;
  }
  negate<SubjectType extends "posts" | "users">(
    _subjectType: SubjectType,
    condition: { posts: PostsWhereInput; users: UsersWhereInput }[SubjectType],
  ): { posts: PostsWhereInput; users: UsersWhereInput }[SubjectType] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { NOT: condition } as any;
  }
}
