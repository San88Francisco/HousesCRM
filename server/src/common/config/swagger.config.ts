import { DocumentBuilder, OpenAPIObject } from '@nestjs/swagger'

export const swaggerConfig: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
  .setTitle('Houses CRM API Documentation')
  .setDescription('API for managing real estate data and related information.')
  .setVersion('1.0')
  .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
  .build()
