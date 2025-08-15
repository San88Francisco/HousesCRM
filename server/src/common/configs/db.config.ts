import { registerAs } from '@nestjs/config'
import { plainToClass } from 'class-transformer'
import { DbConfig } from '../schemas/db-config.schema'
import { validateSync } from 'class-validator'

export default registerAs('database', (): DbConfig => {
  const config = plainToClass(DbConfig, {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USER || 'dev_user',
    password: String(process.env.POSTGRES_PASSWORD),
    database: process.env.POSTGRES_DB || 'dev_db',
  })

  const errors = validateSync(config, { skipMissingProperties: false })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }

  return config
})
