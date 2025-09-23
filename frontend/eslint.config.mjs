import nx from '@nx/eslint-plugin';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  ...tseslint.configs.recommended,
  ...nx.configs['flat/react'],
  {
    parserOptions: {
      tsconfigRootDir: import.meta.dirname,
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
);
