import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const createDbConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.getOrThrow<string>('POSTGRES_HOST'),
  port: configService.getOrThrow<number>('POSTGRES_PORT'),
  username: configService.getOrThrow<string>('POSTGRES_USER'),
  password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
  database: configService.getOrThrow<string>('DB'),
  synchronize: configService.get<string>('NODE_ENV') === 'development',
  logging: true,
  autoLoadEntities: true,
})
