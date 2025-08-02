import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import routes from './src/routes/routes.js';
import { connectDB } from './src/config/db.js';

// Динамічне визначення шляху до .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, './.env') });

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URL) {
  throw new Error('❌ MONGO_URL is not defined in environment variables');
}

connectDB();

// Визначаємо allowedOrigins в залежності від наявності SERVER_URL
const allowedOrigins = process.env.SERVER_URL
  ? [process.env.SERVER_URL]  // продакшен URL
  : ['http://localhost:3000']; // локальний фронтенд

app.use(cors({
  origin: function (origin, callback) {
    // Дозволити запити без origin (наприклад, curl або серверні запити)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy does not allow access from the origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Swagger',
      version: '1.0.0',
      description: 'Документація API',
    },
    servers: [
      { url: process.env.SERVER_URL || `http://localhost:${PORT}` }
    ],
  },
  apis: ['./src/routes/**/*.js', './src/swagger/**/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(routes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  const url = process.env.SERVER_URL || `http://localhost:${PORT}`;
  console.log(`✅ Server running on ${url}`);
  console.log(`📄 Swagger: ${url}/api-docs`);
});
