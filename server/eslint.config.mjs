// @ts-check
import eslint from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import configPrettier from 'eslint-config-prettier'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'src/db/migrations/*', 'dist/db/migrations/*'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  configPrettier,

  eslintPluginPrettierRecommended,

  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      indent: 'off',

      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/restrict-plus-operands': 'error',
      '@typescript-eslint/restrict-template-expressions': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',

      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true, allowHigherOrderFunctions: true, allowTypedFunctionExpressions: true },
      ],

      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'no-public', overrides: { constructors: 'no-public' } },
      ],

      '@typescript-eslint/explicit-module-boundary-types': 'error',

      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: 'error',
      curly: 'error',
      'no-multi-spaces': 'error',
      'no-trailing-spaces': 'error',
      quotes: ['error', 'single'],
      'no-console': 'error',
      'no-debugger': 'error',
      'no-promise-executor-return': 'error',
      'no-async-promise-executor': 'error',
    },
  }
)
