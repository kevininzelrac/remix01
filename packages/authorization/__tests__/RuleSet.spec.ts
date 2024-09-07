import { beforeEach, describe, expect, it } from "@jest/globals";
import { RuleSet } from "../src/RuleSet.js";
import { MockQueryEngine, SubjectTypeFilters } from "./utils.js";

describe("RuleSet", () => {
  let ruleSet: RuleSet<SubjectTypeFilters>;

  beforeEach(() => {
    ruleSet = RuleSet.new(new MockQueryEngine());
  });

  it("checks against simple allow/forbid rules", () => {
    const simpleRuleSet = ruleSet
      .allow("read", "posts")
      .forbid("read", "users");

    expect(simpleRuleSet.can("read", "posts")).toEqual(true);
    expect(simpleRuleSet.can("read", "users")).toEqual(false);
    expect(simpleRuleSet.cannot("read", "posts")).toEqual(false);
    expect(simpleRuleSet.cannot("read", "users")).toEqual(true);
  });

  it("checks against functional allow rules", () => {
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

  it("checks against functional forbid rules", () => {
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

  it("should allow if allow/forbid rules resolve to a filter", () => {
    const simpleRuleSet = ruleSet
      .allow("read", "posts", { author: "Test" })
      .forbid("write", "posts", { author: "Hidden" });

    expect(simpleRuleSet.can("read", "posts")).toEqual(true);
    expect(simpleRuleSet.can("write", "posts")).toEqual(true);
  });

  it("should favor forbid over allow", () => {
    const simpleRuleSet = ruleSet
      .allow("read", "posts")
      .forbid("read", "posts");

    expect(simpleRuleSet.can("read", "posts")).toEqual(false);
  });

  it("should not allow if forbid returns false and no other rule allows", () => {
    const simpleRuleSet = ruleSet.forbid(
      "create",
      "posts",
      (user: { role: "admin" | "author" | "reader" }) => {
        return user.role === "reader";
      },
    );

    expect(simpleRuleSet.can("create", "posts", { role: "admin" })).toEqual(
      false,
    );
  });
});
