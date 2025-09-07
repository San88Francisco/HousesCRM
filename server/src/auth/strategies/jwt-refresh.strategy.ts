/* eslint-disable */

import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { ConfigService } from '@nestjs/config'
import { UsersService } from 'src/users/users.service'

const fromCookie = (cookieName: string) => (req: Request) => req?.cookies?.[cookieName] ?? null

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly config: ConfigService,
    private readonly users: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([fromCookie(config.get<string>('jwt.refreshCookie')!)]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.refreshSecret')!,
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: { sub: string; email: string; jti: string }) {
    const token = req.cookies?.[this.config.get('jwt.refreshCookie')!]

    const ok = await this.users.isRefreshValid(payload.sub, token)
    if (!ok) throw new UnauthorizedException()

    return { id: payload.sub, email: payload.email }
  }
}
