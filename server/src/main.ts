import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger'
import { AppConfigService } from './common/services/app-config.service'
import { AppConfig } from './common/schemas/app-config.schema'
import { swaggerConfig } from './common/configs/swagger.config'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  const appConfig = app.get(AppConfigService).get<AppConfig>('app')

  if (!appConfig) {
    throw new Error('App configuration not found')
  }
  const { port } = appConfig

  const document: OpenAPIObject = SwaggerModule.createDocument(app, swaggerConfig)
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
