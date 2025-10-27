import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "padding-line-between-statements": [
        "error",
        { "blankLine": "always", "prev": "directive", "next": "*" },
        { "blankLine": "any", "prev": "directive", "next": "directive" }
      ],
      "import/order": ["error", {
        "groups": [
          ["builtin", "external"],
          ["internal"],
          ["parent", "sibling", "index"]
        ],
        "pathGroups": [
          { "pattern": "react", "group": "external", "position": "before" },
          { "pattern": "next/**", "group": "external", "position": "after" },
          { "pattern": "@components/**", "group": "internal", "position": "after" },
          { "pattern": "@contexts/**", "group": "internal", "position": "after" },
          { "pattern": "@/**", "group": "internal", "position": "after" }
        ],
        "pathGroupsExcludedImportTypes": ["react"],
        "newlines-between": "always",
        "alphabetize": { "order": "asc", "caseInsensitive": true }
      }]
    },
  },
]);

export default eslintConfig;
