# Git Hooks Configuration

Цей проект використовує Husky для автоматичної перевірки коду перед комітом та пушем.

## Що перевіряється

### Pre-commit (перед комітом)

- ✅ ESLint перевірка та автовиправлення для змінених файлів
- ✅ Prettier форматування для змінених файлів
- ✅ TypeScript компіляція (без генерації файлів)
- ❌ Коміт буде заблокований при наявності помилок

### Pre-push (перед пушем)

- ✅ ESLint перевірка для всього проекту (client + server)
- ✅ TypeScript компіляція для всього проекту
- ❌ Пуш буде заблокований при наявності помилок

## Як використовувати

### Нормальний коміт

```bash
git add .
git commit -m "feat: add new feature"
```

### Пропустити хуки (тільки в екстрених випадках!)

```bash
git commit -m "urgent fix" --no-verify
git push --no-verify
```

## Налаштування lint-staged

Файли перевіряються залежно від їх розташування:

- `client/**/*.{js,jsx,ts,tsx}` → ESLint + Prettier з налаштуваннями client
- `server/**/*.{js,ts}` → ESLint + Prettier з налаштуваннями server
- `*.{json,md}` → Prettier

## Troubleshooting

### Помилка: "ESLint couldn't find config file"

Переконайтеся, що ви в правильній директорії і файли `eslint.config.js` (client) та `eslint.config.mjs` (server) існують.

### Помилка: "TypeScript compilation failed"

Запустіть перевірку вручну:

```bash
cd client && npx tsc --noEmit
cd server && npx tsc --noEmit
```

### Вимкнути хуки тимчасово

```bash
# Вимкнути для одного коміту
git commit --no-verify

# Повністю вимкнути (не рекомендується)
rm -rf .husky
```
