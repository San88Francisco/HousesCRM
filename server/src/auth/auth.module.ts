import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import jwtConfig from 'src/common/config/jwt.config'
import { UsersModule } from 'src/users/users.module'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategies'
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy'
import { TokensModule } from 'src/tokens/tokens.module'
import { GoogleStrategy } from './strategies/google.strategy'

@Module({
  // TODO JwtModule.register({})
  imports: [UsersModule, PassportModule, TokensModule, ConfigModule.forFeature(jwtConfig), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy, GoogleStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
