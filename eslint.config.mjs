import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import globals from "globals";

const tsRecommendedInSrc = tseslint.configs.recommended.map((conf) => ({
  ...conf,
  files: ["src/**/*.ts"],
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
]);
