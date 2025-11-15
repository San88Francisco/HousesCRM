import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as argon2 from 'argon2'
import ms, { StringValue } from 'ms'
import { JwtPayload } from 'types/jwt/jwt.types'
import { TokensDto } from './dto/tokens.dto'
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto'
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { RefreshTokenDto } from './dto/refresh-token.dto'

@Injectable()
export class TokensService {
  private readonly refreshSecret: string
  private readonly refreshExpiresIn: StringValue
  private readonly accessSecret: string
  private readonly accessExpiresIn: StringValue

  constructor(
    private readonly jwt: JwtService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly config: ConfigService
  ) {
    this.refreshSecret = this.config.getOrThrow<string>('jwt.refreshSecret')
    this.refreshExpiresIn = this.config.getOrThrow<StringValue>('jwt.refreshExp')
    this.accessSecret = this.config.getOrThrow<string>('jwt.accessSecret')
    this.accessExpiresIn = this.config.getOrThrow<StringValue>('jwt.accessExp')
  }

  async verify(payload: JwtPayload, token: string): Promise<JwtPayload | null> {
    const { userAgent, sub } = payload
    const CACHE_KEY = `refresh:${sub}:${userAgent}`

    const cached = await this.cacheManager.get<RefreshTokenDto>(CACHE_KEY)

    if (
      cached &&
      new Date(cached.expiresAt).getTime() > Date.now() &&
      (await argon2.verify(cached.hashedToken, token))
    ) {
      return payload
    }

    return null
  }

  async generateTokens(userId: string, userAgent: string): Promise<TokensDto> {
    const payload = {
      sub: userId,
      userAgent,
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.accessSecret,
        expiresIn: this.accessExpiresIn,
      }),
      this.jwt.signAsync(payload, {
        secret: this.refreshSecret,
        expiresIn: this.refreshExpiresIn,
      }),
    ])

    this.create({ payload, token: refreshToken }).catch((err) =>
      // TODO: Implement Logger
      // eslint-disable-next-line no-console
      console.error('Failed to store refresh token in Redis', err)
    )

    return { accessToken, refreshToken }
  }

  rotate(userId: string, userAgent: string): Promise<TokensDto> {
    return this.generateTokens(userId, userAgent)
  }

  async create(data: CreateRefreshTokenDto): Promise<void> {
    const { payload, token } = data

    const CACHE_KEY = `refresh:${payload.sub}:${payload.userAgent}`
    const TTL = ms(this.refreshExpiresIn)

    const raw = {
      hashedToken: await argon2.hash(token),
      expiresAt: new Date(Date.now() + ms(this.refreshExpiresIn)),
    }

    await this.cacheManager.set(CACHE_KEY, raw, TTL)
  }

  async remove(userId: string, userAgent: string): Promise<void> {
    const CACHE_KEY = `refresh:${userId}:${userAgent}`
    await this.cacheManager.del(CACHE_KEY)
  }
}
