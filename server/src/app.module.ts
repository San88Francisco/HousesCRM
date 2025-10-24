import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { createDbConfig } from './common/config/db.config'
import { UsersModule } from './users/users.module'
import { HousesModule } from './houses/houses.module'
import { ContractsModule } from './contracts/contracts.module'
import { RentersModule } from './renters/renters.module'
import { HousesAnalyticsModule } from './analytics/houses-analytics/houses-analytics.module'
import { AuthModule } from './auth/auth.module'
import { TokensModule } from './tokens/tokens.module'
import KeyvRedis from '@keyv/redis'
import { Keyv } from 'keyv'
import { CacheModule } from '@nestjs/cache-manager'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createDbConfig,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          stores: [
            new Keyv({
              store: new KeyvRedis(configService.getOrThrow('REDIS_URL')),
              ttl: 60000,
            }),
          ],
        }
      },
    }),
    UsersModule,
    TokensModule,
    HousesModule,
    ContractsModule,
    RentersModule,
    HousesAnalyticsModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
