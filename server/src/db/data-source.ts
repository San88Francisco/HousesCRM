import { DataSource } from 'typeorm'
import { config } from 'dotenv'
import { createDatabaseConfig } from './db.factory'
import { Test } from 'src/test-module/entities/test.entity'

config()

export const AppDataSource = new DataSource({
  ...createDatabaseConfig(),
  entities: [Test],
  migrations: ['src/db/migrations/*.ts'],
  synchronize: false,
  logging: true,
})
