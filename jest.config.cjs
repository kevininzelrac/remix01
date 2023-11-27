/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.spec.[jt]s?(x)"],
  moduleNameMapper: {
    "~/(.*)": "<rootDir>/app/$1",
    "__tests__/(.*)": "<rootDir>/__tests__/$1",
  },
};
