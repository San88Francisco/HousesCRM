import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { randomUUID } from 'crypto'
import * as argon2 from 'argon2'

import { RefreshToken } from './entities/refresh-token.entity'
import { JwtPayload } from 'types/jwt/jwt.types'

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(RefreshToken) private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  private async signAccess(userId: string): Promise<string> {
    const payload = { sub: userId, jti: randomUUID() }
    return this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>('jwt.accessSecret'),
      expiresIn: this.config.getOrThrow<string>('jwt.accessExp'),
    })
  }

  private async signRefresh(userId: string): Promise<{
    token: string
    payload: { sub: string; jti: string }
    expMs: number
  }> {
    const payload = { sub: userId, jti: randomUUID() }
    const expiresIn = this.config.getOrThrow<string>('jwt.refreshExp')
    const secret = this.config.getOrThrow<string>('jwt.refreshSecret')
    const token = await this.jwt.signAsync(payload, { secret, expiresIn })

    const decodedRaw: string = this.jwt.decode(token)
    let expMs = 0

    if (decodedRaw && typeof decodedRaw === 'object' && 'exp' in decodedRaw) {
      const exp = (decodedRaw as { exp?: unknown }).exp
      if (typeof exp === 'number') {
        expMs = Math.max(0, exp * 1000 - Date.now())
      }
    }

    return { token, payload, expMs }
  }

  public async generateTokens(
    userId: string,
    userAgent?: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refresh] = await Promise.all([this.signAccess(userId), this.signRefresh(userId)])
    const { token: refreshToken, payload, expMs } = refresh

    const row = this.refreshTokenRepository.create({
      user: { id: userId },
      jti: payload.jti,
      hashedToken: await argon2.hash(refreshToken),
      expiresAt: new Date(Date.now() + expMs),
      userAgent: userAgent ?? null,
    })
    await this.refreshTokenRepository.save(row)

    return { accessToken, refreshToken }
  }

  public async verifyAndGet(userId: string, refreshToken: string): Promise<{ row: RefreshToken; email?: string }> {
    const decoded = await this.jwt
      .verifyAsync<JwtPayload>(refreshToken, {
        secret: this.config.getOrThrow<string>('jwt.refreshSecret'),
      })
      .catch(() => {
        throw new UnauthorizedException('Invalid refresh token')
      })

    if (decoded.sub !== userId) {
      throw new UnauthorizedException('Token/user mismatch')
    }

    const row = await this.refreshTokenRepository.findOne({
      where: { jti: decoded.jti, user: { id: userId } },
      relations: ['user'],
    })

    if (!row || row.revoked || row.expiresAt <= new Date()) {
      throw new UnauthorizedException('Refresh token revoked or expired')
    }

    const ok = await argon2.verify(row.hashedToken, refreshToken)
    if (!ok) {
      await this.revokeAll(userId)
      throw new UnauthorizedException('Refresh token reuse detected')
    }
    return { row, email: decoded.email }
  }

  public async rotate(
    userId: string,
    currentRefresh: string,
    userAgent: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { row } = await this.verifyAndGet(userId, currentRefresh)
    row.revoked = true
    await this.refreshTokenRepository.save(row)
    return this.generateTokens(userId, userAgent)
  }

  public async revokeAll(userId: string): Promise<void> {
    await this.refreshTokenRepository
      .createQueryBuilder()
      .update()
      .set({ revoked: true })
      .where('"userId" = :userId AND revoked = false', { userId })
      .execute()
  }
}
