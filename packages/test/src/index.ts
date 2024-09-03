import { RuleSet, QueryEngine } from "@app/authorization";

type Test_SubjectTypeFilters = {
  posts: number;
  comments: {
    first: number;
    second?: number;
  };
};

const rules = RuleSet.new({} as any as QueryEngine<Test_SubjectTypeFilters>)
  .allow("read", "posts")
  .allow("read", "posts", async (user: { id: number }) => true)
  .forbid("create", "comments", { first: 100 })
  // FIXME: This function's return type should be Promise<number>, so we screwed up something.
  .accessible("read", "posts", { id: 100 });
