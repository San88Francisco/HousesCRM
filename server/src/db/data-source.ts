import { DataSource } from 'typeorm'
import { config } from 'dotenv'
import { createDatabaseConfig } from './db.factory'

config()

export const AppDataSource = new DataSource({
  ...createDatabaseConfig(),
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: false,
  logging: true,
})
