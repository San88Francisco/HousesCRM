import { registerAs } from '@nestjs/config'
import { plainToClass } from 'class-transformer'
import { validateSync } from 'class-validator'
import { AppConfig } from '../schemas/app-config.schema'

export default registerAs('app', (): AppConfig => {
  const config = plainToClass(AppConfig, {
    port: Number(process.env.PORT) || 8000,
  })

  const errors = validateSync(config, { skipMissingProperties: false })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }

  return config
})
