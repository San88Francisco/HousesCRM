import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger'
import { swaggerConfig } from './common/config/swagger.config'
import { ConfigService } from '@nestjs/config'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  const port = app.get(ConfigService).get<string>('PORT') || 8000

  const document: OpenAPIObject = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('doc', app, document)

  app.setGlobalPrefix('api')

  await app.listen(port)
  // eslint-disable-next-line no-console
  console.log(`Application is running on: http://localhost:${port}`)
}

bootstrap().catch((err: unknown) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
