import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule } from '@nestjs/swagger'
import { swaggerConfig } from './common/config/swagger.config'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe, UnprocessableEntityException, ValidationError } from '@nestjs/common'

const flattenErrors = (
  errs: ValidationError[],
  parent = '',
  acc: Record<string, string> = {}
): Record<string, string> => {
  for (const e of errs) {
    const path = parent ? `${parent}.${e.property}` : e.property
    if (e.constraints) {
      acc[path] = Object.values(e.constraints)[0]
    }
    if (e.children?.length) {
      flattenErrors(e.children, path, acc)
    }
  }
  return acc
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  const port = app.get(ConfigService).get<string>('PORT') || 8000

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('doc', app, document)

  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: false,
      validationError: { target: false, value: false },
      exceptionFactory: (errors: ValidationError[]) =>
        new UnprocessableEntityException({
          error: 'Validation Error',
          message: flattenErrors(errors),
        }),
    })
  )

  await app.listen(port)
  // eslint-disable-next-line no-console
  console.log(`Application is running on: http://localhost:${port}`)
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
