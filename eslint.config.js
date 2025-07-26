import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import prettier from "eslint-plugin-prettier";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  {
    ignores: [
      "**/*.config.js",
      "**/tsconfig.json",
      "**/tsconfig.node.json",
      "**/dist/",
      "**/build/",
      "**/.next/",
      "**/.git/",
      "**/node_modules/",
      "**/package-lock.json",
      "**/package.json",
    ],

    files: ["**/*.{ts,tsx}"],

    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.node,
        JSX: true,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      react,
      prettier,
      "unused-imports": unusedImports,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Базові рекомендовані правила ESLint + TS + React Hooks
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // Видаляємо не використані імпорти — помилка
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error", // Зараз це помилка, щоб інтерни одразу виправляли
        {
          vars: "all",
          varsIgnorePattern: "^_", // Змінні починаючи з _ — ігноруємо
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // React Refresh: строго перевіряємо експорт компонентів
      "react-refresh/only-export-components": [
        "error",
        { allowConstantExport: true },
      ],

      // Жорсткі обмеження на типи (забороняємо any)
      "@typescript-eslint/no-explicit-any": "error",

      // Забороняємо небезпечне скасування null (non-null assertions)
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "error",

      // Обов’язково використовуємо фігурні дужки в будь-яких блоках
      curly: ["error", "all"],

      // Обмежуємо складність функцій до 4 (ще жорсткіше)
      complexity: ["error", 4],

      // Максимальна довжина файлу 200 рядків (без пропусків і коментарів)
      "max-lines": [
        "error",
        { max: 200, skipBlankLines: true, skipComments: true },
      ],

      // Вимоги до стилю Prettier як помилка
      "prettier/prettier": "error",

      // Не дозволяємо any-типи в PropTypes — вимикаємо, бо TS кращий
      "react/prop-types": "off",

      // Потрібно, щоб React був імпортований у JSX (можеш вимкнути, якщо React 17+)
      "react/react-in-jsx-scope": "off",

      // Строгі правила React Hooks (заперечення помилок)
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      "no-restricted-syntax": [
        "error",
        {
          selector:
            "FunctionDeclaration:not(ExportDefaultDeclaration > FunctionDeclaration)",
          message:
            "Використовуйте стрілкові функції, крім export default function",
        },
      ],

      // Додаткові корисні правила ESLint для чистоти коду:
      eqeqeq: ["error", "always"], // Використовувати ===, а не ==
      "no-var": "error", // Заборонити var, тільки let/const
      "prefer-const": ["error", { destructuring: "all" }], // Використовувати const де можна
      "no-console": ["error", { allow: ["warn", "error"] }], // console.log — попередження
      "no-debugger": "error", // Заборонити debugger
      "no-empty-function": "warn", // Попередження про пусті функції
      "no-unreachable": "error", // Забороняємо недосяжний код
      "spaced-comment": ["error", "always"], // Пробіли після коментарів
      "no-magic-numbers": [
        "warn",
        { ignore: [0, 1], ignoreArrayIndexes: true },
      ], // Мінімізувати "магічні" числа
    },
  },
];
