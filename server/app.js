const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const routes = require('./src/routes/routes');

const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'API для керування квартирами',
      version: '1.0.0',
      description: 'Документація API для управління квартирами',
    },
    basePath: '/',
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: 'JWT токен для аутентифікації',
      },
    },
  },
  apis: ['./src/routes/**/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(bodyParser.json());

app.use('/api', routes);

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
  console.log('Swagger UI is available at http://localhost:5000/api-docs');
});

// user
// {
//   "username": "admin",
//   "password": "#123456789"
// }
