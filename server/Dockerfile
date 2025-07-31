# Встановлюємо Node.js
FROM node:18-alpine

# Встановлюємо робочу директорію
WORKDIR /app

# Копіюємо файли package.json і встановлюємо залежності
COPY package*.json ./
RUN npm install

# Копіюємо весь код
COPY . .

# Відкриваємо порт, на якому буде працювати сервер
EXPOSE 5000

# Запускаємо сервер
CMD ["npm", "start"]
