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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, './.env') });

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URL) {
  throw new Error('❌ MONGO_URL is not defined in environment variables');
}

connectDB();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Swagger',
      version: '1.0.0',
      description: 'Документація API',
    },
    servers: [{ url: process.env.SERVER_URL || `http://localhost:${PORT}` }]
  },
  apis: ['./src/routes/**/*.js', './src/swagger/**/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://troubled-paula-step-029fdb19.koyeb.app'
    ],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(routes);

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  const url = process.env.SERVER_URL || `http://localhost:${PORT}`;
  console.log(`✅ Server running on ${url}`);
  console.log(`📄 Swagger: ${url}/api-docs`);
});
