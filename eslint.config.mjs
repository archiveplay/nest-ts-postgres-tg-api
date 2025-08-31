// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module', // можно оставить commonjs если нужно
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // TypeScript правила
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises':
        'warn',
      '@typescript-eslint/no-unsafe-argument':
        'warn',

      // Prettier правила
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true,
          semi: true,
          tabWidth: 2,
          useTabs: false,
          trailingComma: 'es5',
          bracketSpacing: true,
          printWidth: 80,
        },
      ],

      // Сортировка импортов
      'import/order': [
        'warn',
        {
          groups: [
            ['builtin', 'external'],
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  }
);
