import typescriptParser from "@typescript-eslint/parser";
import globals from "globals";

export default {
  languageOptions: {
    parser: typescriptParser,
    ecmaVersion: 2022,
    globals: {
      ...globals.node,
    },
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:import/recommended",
      "plugin:import/typescript",
      "plugin:prettier/recommended"
  ],
  "settings": {
    "import/resolver": {
      "typescript": {},
      "node": {}
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    }
  },
  "rules": {
      "@typescript-eslint/no-useless-constructor": "error",
      "no-useless-constructor": "off",
      "prettier/prettier": "error"
  },
  "overrides": [
    {
      "files": ["**/*.jsx", "**/*.tsx"],
      "extends": [
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended"
      ],
      "plugins": [
        "react",
        "jsx-a11y"
      ],
      "env": {
        "browser": true
      },
      "settings": {
        "react": {
          "version": "detect"
        }
      }
    },
    {
      "files": ["**/__tests__/**/*"],
      "extends": [
        "plugin:jest/recommended",
        "plugin:jest-dom/recommended",
        "plugin:testing-library/react"
      ],
      "plugins": [
        "jest",
        "jest-dom",
        "testing-library"
      ],
      "env": {
        "jest": true,
        "jest/globals": true
      },
      "rules": {
        "testing-library/no-await-sync-queries": "off"
      }
    }
  ]
};
