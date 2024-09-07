import { RuleSet, QueryEngine } from "@app/authorization";

type Test_SubjectTypeFilters = {
  posts: number;
  comments: {
    first: number;
    second?: number;
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
const test = RuleSet.new({} as any as QueryEngine<Test_SubjectTypeFilters>)
  .allow("read", "posts")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .allow("read", "posts", async (user: { id: number }) => true)
  .forbid("create", "comments", { first: 100 })
  .accessible("read", "posts", { id: 100 });
