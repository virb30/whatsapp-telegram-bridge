import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

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
    ],
  },
  ...tsRecommendedInSrc,
]);
