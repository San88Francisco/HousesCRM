import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'
import ms, { StringValue } from 'ms'
import { JwtPayload } from 'types/jwt/jwt.types'
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { TokensDto } from './dto/tokens.dto'

const ROTATION_GRACE_MS = 60_000

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
    const cached = await this.cacheManager.get<RefreshTokenDto>(this.sessionKey(sub, userAgent))

    if (!cached) {
      return null
    }

    if (new Date(cached.expiresAt).getTime() > Date.now() && (await argon2.verify(cached.hashedToken, token))) {
      return payload
    }

    if (
      cached.prevHashedToken &&
      cached.prevValidUntil &&
      new Date(cached.prevValidUntil).getTime() > Date.now() &&
      (await argon2.verify(cached.prevHashedToken, token))
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

    try {
      await this.create({ payload, token: refreshToken })
    } catch {
      throw new InternalServerErrorException('Could not persist session')
    }

    return { accessToken, refreshToken }
  }

  async rotate(userId: string, userAgent: string): Promise<TokensDto> {
    const recentKey = this.recentRotationKey(userId, userAgent)

    const recent = await this.cacheManager.get<TokensDto>(recentKey)
    if (recent) {
      return recent
    }

    const tokens = await this.generateTokens(userId, userAgent)
    await this.cacheManager.set(recentKey, tokens, ROTATION_GRACE_MS)

    return tokens
  }

  async create(data: CreateRefreshTokenDto): Promise<void> {
    const { payload, token } = data

    const CACHE_KEY = this.sessionKey(payload.sub, payload.userAgent)
    const TTL = ms(this.refreshExpiresIn)

    const existing = await this.cacheManager.get<RefreshTokenDto>(CACHE_KEY)

    const raw = {
      hashedToken: await argon2.hash(token),
      expiresAt: new Date(Date.now() + TTL).toISOString(),
      ...(existing && {
        prevHashedToken: existing.hashedToken,
        prevValidUntil: new Date(Date.now() + ROTATION_GRACE_MS).toISOString(),
      }),
    }

    await this.cacheManager.set(CACHE_KEY, raw, TTL)
  }

  async remove(userId: string, userAgent: string): Promise<void> {
    await Promise.all([
      this.cacheManager.del(this.sessionKey(userId, userAgent)),
      this.cacheManager.del(this.recentRotationKey(userId, userAgent)),
    ])
  }

  private sessionKey(userId: string, userAgent: string): string {
    return `refresh:${userId}:${userAgent}`
  }

  private recentRotationKey(userId: string, userAgent: string): string {
    return `refresh:recent:${userId}:${userAgent}`
  }
}
