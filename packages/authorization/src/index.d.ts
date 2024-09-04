// FIXME: Test types using tsd
import "./types";

declare module "@app/authorization" {
  export {
    AbstractFilter,
    FunctionFilter,
    LiteralFilter,
    QueryEngine,
    RuleSet,
  } from "./types";
}
