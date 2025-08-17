import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { createDbConfig } from './common/config/db.config'
import { TestModule } from './test-module/test.module'

@Module({
  imports: [
    TestModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createDbConfig,
    }),
  ],
})
export class AppModule {}
