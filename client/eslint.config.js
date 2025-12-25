// eslint.config.ts
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

// Функція для очищення пробілів з ключів об'єкта globals
function cleanGlobals(obj) {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key.trim(), value]));
}

export default [
  {
    ignores: [
      // === ПОВНЕ ІГНОРУВАННЯ .next ПАПКИ ===
      '**/.next',
      '**/.next/**',
      '**/.next/**/*',
      'client/.next',
      'client/.next/**',
      'client/.next/**/*',

      // === ІНШІ BUILD ПАПКИ ===
      '**/node_modules',
      '**/node_modules/**',
      '**/dist',
      '**/dist/**',
      '**/build',
      '**/build/**',
      '**/out',
      '**/out/**',

      // === CACHE ПАПКИ ===
      '**/.turbo',
      '**/.turbo/**',
      '**/.swc',
      '**/.swc/**',
      '**/.cache',
      '**/.cache/**',
      '.eslintcache',
      '**/.eslintcache',

      // === КОНФІГИ (НЕ ВКЛЮЧАЄМО STORYBOOK) ===
      'next.config.*',
      'tailwind.config.*',
      'postcss.config.*',
      'vite.config.*',
      'vitest.config.*',
      'jest.config.*',
      '**/tsconfig*.json',
      '**/next-env.d.ts',

      // === СТАТИЧНІ ФАЙЛИ ===
      '**/public',
      '**/public/**',

      // === ДОКУМЕНТАЦІЯ ===
      '**/swagger',
      '**/swagger/**',

      // === КОМПОНЕНТИ  ===
      '**/shared/ui/**',
      '**/components/RHF/**',

      // === СИСТЕМНІ ФАЙЛИ ===
      '**/.git',
      '**/.git/**',
      '**/package-lock.json',
      '**/yarn.lock',
      '**/*.log',
      '**/coverage',
      '**/coverage/**',
    ],

    files: [
      'src/**/*.{ts,tsx}',
      'app/**/*.{ts,tsx}',
      'middleware.ts',
      '**/*.stories.{ts,tsx,js}', // story-файли лишаємо у загальному наборі
    ],

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
      prettier, // плагін prettier (для правила prettier/prettier)
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
      // Базові рекомендовані правила ESLint + TS + React Hooks
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // Видаляємо не використані імпорти — помилка
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

      // React Refresh: строго перевіряємо експорт компонентів
      'react-refresh/only-export-components': ['error', { allowConstantExport: true }],

      // Жорсткі обмеження на типи (забороняємо any)
      '@typescript-eslint/no-explicit-any': 'error',

      'import/no-unresolved': 'error',

      // Забороняємо небезпечне скасування null (non-null assertions)
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',

      // Обов'язково використовуємо фігурні дужки в будь-яких блоках
      curly: ['error', 'all'],

      // Обмежуємо складність функцій до 10
      complexity: ['error', 10],

      // Максимальна довжина файлу 200 рядків (без пропусків і коментарів)
      'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],

      // Стиль Prettier як помилка + фікс CRLF/LF
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto', // або 'lf' якщо хочеш суворо LF
        },
      ],

      // React специфіка
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',

      // Строгі правила React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Типові заборонені синтаксиси
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

      // Додаткові корисні правила ESLint для чистоти коду:
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-empty-function': 'warn',
      'no-unreachable': 'error',
      'spaced-comment': ['error', 'always'],
      // 'no-magic-numbers': ['warn', { ignore: [0, 1], ignoreArrayIndexes: true }],
    },
  },

  // ОКРЕМА КОНФІГУРАЦІЯ ДЛЯ STORYBOOK ФАЙЛІВ
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
      // 'no-magic-numbers': 'off',
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

  // Рекомендовані налаштування для storybook
  ...storybook.configs['flat/recommended'],

  // ОСТАННІМ — відключає стилістичні конфлікти на користь Prettier
  eslintConfigPrettier,
];
