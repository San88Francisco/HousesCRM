# HousesCRM

## 🚀 Швидкий старт

### Розробка

```bash
# Запустити client + server одночасно
npm run dev

# Або окремо:
npm run dev --prefix client
npm run start:dev --prefix server
```

## 🎯 Docker

### Запуск окремих сервісів

```bash
# Запустити лише фронтенд
docker-compose up --build client

# Запустити лише бекенд
docker-compose up --build server

# Зупинити окремий сервіс
docker-compose stop client
docker-compose stop server
```

## 🔍 Перевірка коду

### Linting

```bash
# Перевірити весь проект
npm run lint:all

# Тільки client
npm run lint:client

# Тільки server
npm run lint:server
```

### TypeScript перевірка

```bash
# Client
cd client && npx tsc --noEmit

# Server
cd server && npx tsc --noEmit
```

## 🪝 Git Hooks

Проект використовує автоматичні перевірки перед комітом та пушем:

- **Pre-commit**: Перевіряє тільки змінені файли (ESLint + Prettier + TypeScript)
- **Pre-push**: Перевіряє весь проект

Детальніше: [.husky/README.md](.husky/README.md)

### Пропустити перевірки (екстрений випадок)

```bash
git commit --no-verify
git push --no-verify
```
