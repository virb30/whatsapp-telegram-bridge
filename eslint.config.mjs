import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import globals from "globals";

const tsRecommendedInSrc = tseslint.configs.recommended.map((conf) => ({
  ...conf,
  files: ["**/*.ts"],
}));

export default defineConfig([
  {
    ignores: [
      "dist/**",
      "**/*.js",
      "**/*.cjs",
      "**/*.mjs",
      "docs/**",
      "test/**",
    ],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        // Necessário quando há múltiplos tsconfig roots (frontend/backend)
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...tsRecommendedInSrc,
  {
    files: [
      "src/**/*.test.ts",
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    files: ["*.json"],
    parser: "jsonc-eslint-parser",
    rules: {
      "@nx/dependency-checks": "error"
    }
  }
]);
