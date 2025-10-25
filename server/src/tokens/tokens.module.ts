import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { TokensService } from './tokens.service'

@Module({
  imports: [ConfigModule, JwtModule.register({})],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
