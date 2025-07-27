import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import cors from 'cors';
import routes from './src/routes/routes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const HTTP_NOT_FOUND = 404;
const HTTP_INTERNAL_ERROR = 500;
const DEFAULT_PORT = 5000;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Swagger',
      version: '1.0.0',
      description:
        'Документація API для управління квартирами та аутентифікації користувачів',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
  apis: [
    './src/routes/**/*.js',
    './src/swagger/**/*.js',
  ],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// CORS middleware
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Swagger UI
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Documentation',
  })
);

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use(routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(HTTP_NOT_FOUND).json({ message: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(HTTP_INTERNAL_ERROR).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || DEFAULT_PORT;

app.listen(PORT, () => {
  console.warn(`Server is running on http://localhost:${PORT}`);
  console.warn(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
  console.warn(`Health check: http://localhost:${PORT}/health`);
});
