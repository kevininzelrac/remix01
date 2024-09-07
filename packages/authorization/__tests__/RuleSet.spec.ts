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

  test("Test checks against functional allow rules", () => {
    const simpleRuleSet = ruleSet.allow(
      "create",
      "posts",
      (user: { role: "admin" | "author" | "reader" }) => {
        return user.role === "author" || user.role === "admin";
      },
    );

    expect(simpleRuleSet.can("create", "posts", { role: "admin" })).toEqual(
      true,
    );
    expect(simpleRuleSet.can("create", "posts", { role: "author" })).toEqual(
      true,
    );
    expect(simpleRuleSet.can("create", "posts", { role: "reader" })).toEqual(
      false,
    );
  });

  test("Test checks against functional allow rules", () => {
    const simpleRuleSet = ruleSet
      .allow("create", "posts")
      .forbid(
        "create",
        "posts",
        (user: { role: "admin" | "author" | "reader" }) => {
          return user.role === "reader";
        },
      );

    expect(simpleRuleSet.can("create", "posts", { role: "admin" })).toEqual(
      true,
    );
    expect(simpleRuleSet.can("create", "posts", { role: "author" })).toEqual(
      true,
    );
    expect(simpleRuleSet.can("create", "posts", { role: "reader" })).toEqual(
      false,
    );
  });
});
