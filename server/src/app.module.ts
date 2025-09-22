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
    UsersModule,
    TokensModule,
    HousesModule,
    ContractsModule,
    RentersModule,
    AuthModule,
  ],
})
export class AppModule {}
