import { DbConfig } from 'src/common/schemas/db-config.schema'
import { AppConfigService } from 'src/common/services/app-config.service'
import { DataSourceOptions } from 'typeorm'

export const createDatabaseConfig = (configService?: AppConfigService): DataSourceOptions => {
  if (configService) {
    const dbConfig = configService.get<DbConfig>('database')

    return {
      type: 'postgres',
      ...dbConfig,
    }
  }
  return {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.DB,
  }
}
