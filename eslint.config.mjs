export default [
  {
    ignores: ["dist/**", "node_modules/**", "spec/**", "generated/**", "src/generated/**"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: (await import("@typescript-eslint/parser")).default,
    },
    rules: {
      "prettier/prettier": "error",
      "no-console": "off",
      "prefer-const": "error",
      "no-var": "error",
      "one-var": ["error", "never"],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          "vars": "all",
          "varsIgnorePattern": "^_",
          "args": "after-used",
          "argsIgnorePattern": "^_",
          "ignoreRestSiblings": true
        }
      ],
      "no-unused-expressions": "error",
      "no-unreachable": "error",
    },
    plugins: {
      "@typescript-eslint": (await import("@typescript-eslint/eslint-plugin")).default,
      "unused-imports": (await import("eslint-plugin-unused-imports")).default,
      prettier: (await import("eslint-plugin-prettier")).default,
    },
  },
];