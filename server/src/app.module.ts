import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { createDbConfig } from './common/config/db.config'
import { UsersModule } from './users/users.module'
import { HousesModule } from './houses/houses.module'
import { ContractsModule } from './contracts/contracts.module'
import { RentersModule } from './renters/renters.module'
import { AuthModule } from './auth/auth.module'
import { TokensModule } from './tokens/tokens.module'
import KeyvRedis from '@keyv/redis'
import { Keyv } from 'keyv'
import { CacheModule } from '@nestjs/cache-manager'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard'
import { AnalyticsModule } from './analytics/analytics.module'
import { SearchModule } from './search/search.module'
import { ExchangeRatesModule } from './exchange-rates/exchange-rates.module'

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
            }),
          ],
        }
      },
    }),
    UsersModule,
    TokensModule,
    ExchangeRatesModule,
    HousesModule,
    ContractsModule,
    RentersModule,
    AnalyticsModule,
    SearchModule,
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
