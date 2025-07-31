# ──────────────────────────────────────────
# server.Dockerfile (має лежати в корені)
# ──────────────────────────────────────────

FROM node:18-alpine

# де будемо працювати
WORKDIR /app

# копіюємо package.json і lock тільки з server
COPY server/package*.json ./

# встановлюємо залежності (тепер package.json в /app)
RUN npm install --production

# копіюємо весь бекенд-код
COPY server/ ./

# виставляємо порт
EXPOSE 5000

# запускаємо сервер
CMD ["node", "app.js"]
