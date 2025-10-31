import storybook from 'eslint-plugin-storybook';

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';
import unusedImports from 'eslint-plugin-unused-imports';

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
      '**/components/ui/**',
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
      '.storybook/**/*.{ts,tsx,js}', // Додаємо Storybook файли
      '**/*.stories.{ts,tsx,js}', // Додаємо story файли
    ],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json', // Додаємо project для TypeScript
      },
      globals: {
        ...cleanGlobals(globals.browser),
        ...cleanGlobals(globals.node),
        JSX: true,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react,
      prettier,
      'unused-imports': unusedImports,
    },
    settings: {
      react: {
        version: 'detect',
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
          varsIgnorePattern: '^_', // Змінні починаючи з _ — ігноруємо
          args: 'after-used',
          argsIgnorePattern: '^_', // Аргументи починаючи з _ — ігноруємо
        },
      ],
      quotes: [
        'error',
        'single',
        {
          avoidEscape: true, // Дозволити подвійні лапки якщо всередині є одинарні
          allowTemplateLiterals: true, // Дозволити template literals (``)
        },
      ],
      // React Refresh: строго перевіряємо експорт компонентів
      'react-refresh/only-export-components': ['error', { allowConstantExport: true }],

      // Жорсткі обмеження на типи (забороняємо any)
      '@typescript-eslint/no-explicit-any': 'error',

      // Забороняємо небезпечне скасування null (non-null assertions)
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',

      // Обов'язково використовуємо фігурні дужки в будь-яких блоках
      curly: ['error', 'all'],

      // Обмежуємо складність функцій до 4 (ще жорсткіше)
      complexity: ['error', 5],

      // Максимальна довжина файлу 200 рядків (без пропусків і коментарів)
      'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],

      // Вимоги до стилю Prettier як помилка
      'prettier/prettier': 'error',

      // Не дозволяємо any-типи в PropTypes — вимикаємо, бо TS кращий
      'react/prop-types': 'off',

      // Потрібно, щоб React був імпортований у JSX (можеш вимкнути, якщо React 17+)
      'react/react-in-jsx-scope': 'off',

      // Строгі правила React Hooks (заперечення помилок)
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'no-restricted-syntax': 'error',

      // Додаткові корисні правила ESLint для чистоти коду:
      eqeqeq: ['error', 'always'], // Використовувати ===, а не ==
      'no-var': 'error', // Заборонити var, тільки let/const
      'prefer-const': ['error', { destructuring: 'all' }], // Використовувати const де можна
      'no-console': ['error', { allow: ['warn', 'error'] }], // console.log — попередження
      'no-debugger': 'error', // Заборонити debugger
      'no-empty-function': 'warn', // Попередження про пусті функції
      'no-unreachable': 'error', // Забороняємо недосяжний код
      'spaced-comment': ['error', 'always'], // Пробіли після коментарів
      'no-magic-numbers': ['warn', { ignore: [0, 1], ignoreArrayIndexes: true }], // Мінімізувати "магічні" числа
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
    },
    rules: {
      // М'якші правила для конфігураційних файлів
      '@typescript-eslint/no-explicit-any': 'off',
      'no-magic-numbers': 'off',
      'max-lines': 'off',
      complexity: 'off',
    },
  },
  ...storybook.configs['flat/recommended'],
];
