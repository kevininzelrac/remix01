import { beforeEach, describe, expect, test } from "@jest/globals";
import { RuleSet } from "../src/RuleSet.js";
import { MockQueryEngine, SubjectTypeFilters } from "./utils.js";

describe("RuleSet", () => {
  let ruleSet: RuleSet<SubjectTypeFilters>;

  beforeEach(() => {
    ruleSet = RuleSet.new(new MockQueryEngine());
  });

  test("Test checks against simple allow/forbid rules", () => {
    const simpleRuleSet = ruleSet
      .allow("read", "posts")
      .forbid("read", "users");

    expect(simpleRuleSet.can("read", "posts")).toEqual(true);
    expect(simpleRuleSet.can("read", "users")).toEqual(false);
  });
});
