import { AppConfig } from '../schemas/app-config.schema'
import { DbConfig } from '../schemas/db-config.schema'

export interface Config {
  app: AppConfig
  database: DbConfig
}
