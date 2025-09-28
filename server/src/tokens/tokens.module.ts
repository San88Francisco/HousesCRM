import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { RefreshToken } from './entities/refresh-token.entity'
import { TokensService } from './tokens.service'

@Module({
  imports: [ConfigModule, JwtModule.register({}), TypeOrmModule.forFeature([RefreshToken])],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
