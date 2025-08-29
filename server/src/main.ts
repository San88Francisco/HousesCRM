import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule } from '@nestjs/swagger'
import { swaggerConfig } from './common/config/swagger.config'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { dbExceptionFilter } from './common/filters/db-exception.filter'
import { validationConfig } from './common/config/validation.config'
import { typeOrmNotFoundFilter } from './common/filters/typeorm-not-found.filter'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  const port = app.get(ConfigService).get<string>('PORT') || 8000

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('doc', app, document)

  app.setGlobalPrefix('api')

  app.useGlobalPipes(new ValidationPipe(validationConfig))
  app.useGlobalFilters(dbExceptionFilter, typeOrmNotFoundFilter)

  await app.listen(port)
  // eslint-disable-next-line no-console
  console.log(`Application is running on: http://localhost:${port}`)
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
