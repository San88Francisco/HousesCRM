import KeyvRedis from '@keyv/redis'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Keyv } from 'keyv'
import { AnalyticsModule } from './analytics/analytics.module'
import { AuthModule } from './auth/auth.module'
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard'
import { createDbConfig } from './common/config/db.config'
import jwtConfig from './common/config/jwt.config'
import { ContractsModule } from './contracts/contracts.module'
import { HousesModule } from './houses/houses.module'
import { MapModule } from './map/map.module'
import { RentersModule } from './renters/renters.module'
import { SearchModule } from './search/search.module'
import { TokensModule } from './tokens/tokens.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
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
    HousesModule,
    ContractsModule,
    RentersModule,
    AnalyticsModule,
    SearchModule,
    MapModule,
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
