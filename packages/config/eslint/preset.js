import eslint from '@eslint/js';
import typescriptParser from "@typescript-eslint/parser";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import jest from "eslint-plugin-jest";
import globals from "globals";
import react from "eslint-plugin-react";
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
      },
    },
    settings: {
      "import/resolver": {
        "typescript": {},
        "node": {}
      },
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"]
      }
    },
    rules: {
        "@typescript-eslint/no-useless-constructor": "error",
        "no-useless-constructor": "off",
        "prettier/prettier": "error"
    },
  },
  {
    files: ["**/*.jsx", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      react,
    },
    settings: {
      react: {
        version: "detect"
      },
    },
  },
  {
    ...jest.configs["flat/recommended"],
    files: ["**/__tests__/**/*"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      ...jest.configs['flat/recommended'].rules,
      "testing-library/no-await-sync-queries": "off"
    },
  },
  eslintPluginPrettier
);
