import storybook from 'eslint-plugin-storybook';

import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

function cleanGlobals(obj) {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key.trim(), value]));
}

export default [
  {
    ignores: [
      '**/.next',
      '**/.next/**',
      '**/.next/**/*',
      'client/.next',
      'client/.next/**',
      'client/.next/**/*',

      '**/node_modules',
      '**/node_modules/**',
      '**/dist',
      '**/dist/**',
      '**/build',
      '**/build/**',
      '**/out',
      '**/out/**',

      '**/.turbo',
      '**/.turbo/**',
      '**/.swc',
      '**/.swc/**',
      '**/.cache',
      '**/.cache/**',
      '.eslintcache',
      '**/.eslintcache',

      'next.config.*',
      'tailwind.config.*',
      'postcss.config.*',
      'vite.config.*',
      'vitest.config.*',
      'jest.config.*',
      '**/tsconfig*.json',
      '**/next-env.d.ts',

      '**/public',
      '**/public/**',

      '**/swagger',
      '**/swagger/**',

      '**/shared/ui/**',
      '**/components/RHF/**',

      '**/.git',
      '**/.git/**',
      '**/package-lock.json',
      '**/yarn.lock',
      '**/*.log',
      '**/coverage',
      '**/coverage/**',
    ],

    files: ['src/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}', 'middleware.ts', '**/*.stories.{ts,tsx,js}'],

    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        ...cleanGlobals(globals.browser),
        ...cleanGlobals(globals.node),
        JSX: true,
      },
    },

    plugins: {
      '@typescript-eslint': tseslint,
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier,
      'unused-imports': unusedImports,
      import: importPlugin,
    },

    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },

    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],

      'react-refresh/only-export-components': ['error', { allowConstantExport: true }],

      '@typescript-eslint/no-explicit-any': 'error',

      'import/no-unresolved': 'error',

      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',

      curly: ['error', 'all'],

      complexity: ['error', 10],

      'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],

      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],

      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message: 'Уникай for..in — використовуй Object.keys/entries замість цього.',
        },
        {
          selector: 'LabeledStatement',
          message: 'Labels ускладнюють читання коду.',
        },
        {
          selector: 'WithStatement',
          message: '`with` заборонений у strict mode і нечіткий.',
        },
      ],

      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-empty-function': 'warn',
      'no-unreachable': 'error',
      'spaced-comment': ['error', 'always'],
    },
  },

  {
    files: ['.storybook/**/*.{ts,tsx,js}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        ...cleanGlobals(globals.browser),
        ...cleanGlobals(globals.node),
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',

      'max-lines': 'off',
      complexity: 'off',
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
    },
  },

  ...storybook.configs['flat/recommended'],

  eslintConfigPrettier,
];
