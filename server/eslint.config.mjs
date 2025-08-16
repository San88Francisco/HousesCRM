// @ts-check
import eslint from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'src/db/migrations/*', 'dist/db/migrations/*'],
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
      sourceType: 'module', // Змінено на module для сучасного JS
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // TypeScript правила
      '@typescript-eslint/no-explicit-any': 'error', // Забороняє використання `any`
      '@typescript-eslint/no-floating-promises': 'error', // Вимагає обробки Promise
      '@typescript-eslint/no-unsafe-argument': 'error', // Забороняє небезпечні аргументи
      '@typescript-eslint/no-unsafe-assignment': 'error', // Забороняє небезпечні присвоєння
      '@typescript-eslint/no-unsafe-call': 'error', // Забороняє небезпечні виклики
      '@typescript-eslint/no-unsafe-member-access': 'error', // Забороняє небезпечний доступ до членів
      '@typescript-eslint/require-await': 'error', // Вимагає async для асинхронних функцій
      '@typescript-eslint/await-thenable': 'error', // Забороняє await не-thenable значень
      '@typescript-eslint/no-misused-promises': 'error', // Забороняє неправильне використання Promise
      '@typescript-eslint/no-unnecessary-type-assertion': 'error', // Забороняє зайві type assertions
      '@typescript-eslint/restrict-plus-operands': 'error', // Перевіряє операнди для +
      '@typescript-eslint/restrict-template-expressions': 'error', // Перевіряє шаблонні рядки
      '@typescript-eslint/no-non-null-assertion': 'error', // Забороняє non-null assertion (!)

      // NestJS специфічні правила
      '@typescript-eslint/explicit-function-return-type': [
        // Вимагає явний тип повернення
        'error',
        {
          allowExpressions: true,
          allowHigherOrderFunctions: true,
          allowTypedFunctionExpressions: true,
        },
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        // Вимагає явні модифікатори доступу
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            constructors: 'no-public',
          },
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'error', // Вимагає типи для експортів

      // Стиль коду
      'prefer-const': 'error', // Вимагає const для незмінних змінних
      'no-var': 'error', // Забороняє var
      eqeqeq: 'error', // Вимагає === замість ==
      curly: 'error', // Вимагає фігурні дужки для блоків
      'no-multi-spaces': 'error', // Забороняє багато пробілів
      'no-trailing-spaces': 'error', // Забороняє пробіли в кінці рядка
      indent: ['error', 2], // Відступи 2 пробіли
      quotes: ['error', 'single'], // Одинарні лапки

      // Помилки
      'no-console': 'error', // Забороняє console.log
      'no-debugger': 'error', // Забороняє debugger

      // Асинхронний код
      'no-promise-executor-return': 'error', // Забороняє return в Promise executor
      'no-async-promise-executor': 'error', // Забороняє async Promise executor
    },
  }
)
