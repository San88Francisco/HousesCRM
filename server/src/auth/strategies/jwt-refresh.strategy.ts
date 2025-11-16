import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { ConfigService } from '@nestjs/config'
import { TokensService } from 'src/tokens/tokens.service'
import { JwtPayload } from 'types/jwt/jwt.types'
import { fromCookie } from 'src/utils/cookie-value'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly config: ConfigService,
    private readonly tokens: TokensService
  ) {
    const refreshCookieName = config.getOrThrow<string>('jwt.refreshCookie')
    const refreshSecret = config.getOrThrow<string>('jwt.refreshSecret')

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([fromCookie(refreshCookieName)]),
      ignoreExpiration: false,
      secretOrKey: refreshSecret,
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: JwtPayload): Promise<JwtPayload | null> {
    const cookieKey = this.config.getOrThrow<string>('jwt.refreshCookie')
    const refreshToken = fromCookie(cookieKey)(req) || ''

    return await this.tokens.verify(payload, refreshToken)
  }
}
