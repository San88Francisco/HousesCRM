import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import appConfig from './common/configs/app.config'
import { AppConfigService } from './common/services/app-config.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import dbConfig from './common/configs/db.config'
import { createDatabaseConfig } from './db/db.factory'
import { TestModule } from './test-module/test.module'

@Module({
  imports: [
    TestModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: AppConfigService) => ({
        ...createDatabaseConfig(configService),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppModule {}
