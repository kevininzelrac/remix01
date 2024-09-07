import { beforeEach, describe, expect, it } from "@jest/globals";
import { RuleSet } from "../src/RuleSet.js";
import { MockQueryEngine, SubjectTypeFilters } from "./utils.js";
import { EvaluatedRule } from "../src/EvaluatedRule.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPromise(value: any): value is Promise<any> {
  return value && typeof value.then === "function";
}

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

  it("should return a promise if any of the functional rules returns a promise", () => {
    const simpleRuleSet = ruleSet
      .allow("create", "posts")
      .forbid(
        "create",
        "posts",
        async (user: { role: "admin" | "author" | "reader" }) => {
          return user.role === "reader";
        },
      );
    expect(
      isPromise(simpleRuleSet.can("create", "posts", { role: "admin" })),
    ).toEqual(true);
    expect(
      simpleRuleSet.can("create", "posts", { role: "admin" }),
    ).resolves.toEqual(true);
    expect(
      simpleRuleSet.can("create", "posts", { role: "reader" }),
    ).resolves.toEqual(false);
  });

  it("should return correct filters when accessible is called", () => {
    const simpleRuleSet = ruleSet
      .allow("read", "posts")
      .forbid(
        "read",
        "posts",
        (user: { status: "subscribed" | "unsubscribed" }) => {
          if (user.status === "unsubscribed") return true;
          return {
            author: "HIDDEN",
          };
        },
      );

    expect(
      simpleRuleSet.accessible("read", "posts", { status: "unsubscribed" }),
    ).toEqual({ AND: [true, false] });
    expect(
      simpleRuleSet.accessible("read", "posts", { status: "subscribed" }),
    ).toEqual({ AND: [true, { NOT: { author: "HIDDEN" } }] });
  });

  it("should return correct filters when accessible is called if functional rule returns promise", () => {
    const simpleRuleSet = ruleSet
      .allow("read", "posts")
      .forbid(
        "read",
        "posts",
        async (user: { status: "subscribed" | "unsubscribed" }) => {
          if (user.status === "unsubscribed") return true;
          return {
            author: "HIDDEN",
          };
        },
      );

    expect(
      isPromise(
        simpleRuleSet.accessible("read", "posts", { status: "unsubscribed" }),
      ),
    ).toEqual(true);
    expect(
      simpleRuleSet.accessible("read", "posts", { status: "unsubscribed" }),
    ).resolves.toEqual({ AND: [true, false] });
    expect(
      simpleRuleSet.accessible("read", "posts", { status: "subscribed" }),
    ).resolves.toEqual({ AND: [true, { NOT: { author: "HIDDEN" } }] });
  });

  it("should return an evaluated rule when calling getRule", () => {
    const simpleRuleSet = ruleSet
      .allow("read", "posts")
      .forbid("read", "users");

    expect(simpleRuleSet.getRule("read", "posts")).toBeInstanceOf(
      EvaluatedRule,
    );
    expect(simpleRuleSet.getRule("read", "posts").can()).toEqual(true);
    expect(simpleRuleSet.getRule("read", "users").cannot()).toEqual(true);
    expect(simpleRuleSet.getRule("read", "posts").accessible()).toEqual({
      AND: [true],
    });
  });
});
