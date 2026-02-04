import tseslint from 'typescript-eslint';
import { baseConfig } from '../../eslint.base.mjs';

export default tseslint.config(
  ...baseConfig,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    },
  },
  {
    ignores: ['dist/'],
  },
);
