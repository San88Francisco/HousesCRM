import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  const port = Number(process.env.PORT) || 8000

  const config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('Houses CRM API Documentation')
    .setDescription('API for managing real estate data and related information.')
    .setVersion('1.0')
    .build()

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(port)
  // eslint-disable-next-line no-console
  console.log(`Application is running on: http://localhost:${port}`)
}

bootstrap().catch((err: unknown) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
