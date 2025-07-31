FROM node:18-alpine

WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server/ .
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/main"]
