/* eslint-disable */

import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common'
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
    const refreshCookieName = config.get<string>('jwt.refreshCookie') ?? 'refresh_token'
    const refreshSecret = config.get<string>('jwt.refreshSecret') ?? 'change-me'

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([fromCookie(refreshCookieName)]),
      ignoreExpiration: false,
      secretOrKey: refreshSecret,
      passReqToCallback: true,
    })
  }

  public async validate(req: Request, payload: JwtPayload): Promise<{ id: string; email: string }> {
    const cookieKey = this.config.get<string>('jwt.refreshCookie') ?? 'refresh_token'

    const rawToken: unknown = (req as unknown as { cookies?: Record<string, unknown> }).cookies?.[cookieKey]
    if (typeof rawToken !== 'string' || !rawToken) {
      throw new UnauthorizedException()
    }

    await this.tokens.verifyAndGet(payload.sub, rawToken)
    return { id: payload.sub, email: payload.email }
  }
}
