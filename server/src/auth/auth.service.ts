import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { UsersService } from '../users/users.service'
import { randomUUID } from 'crypto'

type JwtPayload = { sub: string; email: string; jti: string }
type UserWithPassword = { id: string; email: string; password: string }
type LoginResult = { id: string; email: string; token: string }
type RotateResult = { token: string }

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  public async validateUser(email: string, password: string): Promise<UserWithPassword | null> {
    const user = (await this.users.findOne(email)) as UserWithPassword | null
    if (!user) {
      return null
    }

    const ok = await argon2.verify(user.password, password)
    if (!ok) {
      throw new BadRequestException('User or password is incorrect')
    }

    return user
  }

  private signAccess(userId: string, email: string): Promise<string> {
    const payload: JwtPayload = { sub: userId, email, jti: randomUUID() }
    return this.jwt.signAsync(payload, {
      secret: this.config.get<string>('jwt.accessSecret'),
      expiresIn: this.config.get<string>('jwt.accessExp'),
    })
  }

  private signRefresh(userId: string, email: string): Promise<string> {
    const payload: JwtPayload = { sub: userId, email, jti: randomUUID() }
    return this.jwt.signAsync(payload, {
      secret: this.config.get<string>('jwt.refreshSecret'),
      expiresIn: this.config.get<string>('jwt.refreshExp'),
    })
  }

  public async login(user: { id: string; email: string }): Promise<LoginResult> {
    const [access, refresh] = await Promise.all([
      this.signAccess(user.id, user.email),
      this.signRefresh(user.id, user.email),
    ])

    await this.users.setRefreshHash(user.id, await argon2.hash(refresh))
    return { id: user.id, email: user.email, token: access }
  }

  public async rotateRefresh(userId: string, currentRefresh: string): Promise<RotateResult> {
    const valid = await this.users.isRefreshValid(userId, currentRefresh)
    if (!valid) {
      throw new BadRequestException('Invalid refresh token')
    }

    const user = await this.users.findById(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const [access, nextRefresh] = await Promise.all([
      this.signAccess(userId, user.email),
      this.signRefresh(userId, user.email),
    ])

    await this.users.setRefreshHash(userId, await argon2.hash(nextRefresh))
    return { token: access }
  }

  public async logout(userId: string): Promise<void> {
    await this.users.clearRefresh(userId)
  }
}
