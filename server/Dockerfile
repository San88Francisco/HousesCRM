# server/Dockerfile

FROM node:18-alpine

# робоча директорія всередині контейнера
WORKDIR /app

# копіюємо лише файли package.json та lockfile з локального контексту
COPY package*.json ./

# встановлюємо лише production-залежності
RUN npm install --production

# копіюємо весь код сервера в контейнер
COPY . .

# виставляємо порт
EXPOSE 5000

# запускаємо сервер
CMD ["node", "app.js"]
