/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testEnvironment: "node",
  testMatch: ["**/*.spec.ts(x)?"],
  testPathIgnorePatterns: ["/dist/"],
  transform: {
    "^.+.tsx?$": ["ts-jest", { useESM: true }],
  },
};
