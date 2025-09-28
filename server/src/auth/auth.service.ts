import { Injectable } from '@nestjs/common'
import * as argon2 from 'argon2'
import { UsersService } from '../users/users.service'
import { UserDto } from 'src/users/dto/user.dto'
import { plainToInstance } from 'class-transformer'
import { LoginUserDto } from 'src/users/dto/login-user.dto'
import { TokensService } from 'src/tokens/tokens.service'
import { TokensDto } from 'src/tokens/dto/tokens.dto'
import { CreateUserRequestDto } from 'src/users/dto/req/create-user-req.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly tokens: TokensService
  ) {}

  public async validateUser(email: string, password: string): Promise<UserDto | null> {
    const user = await this.users.findOne(email)
    const isValid = user && (await argon2.verify(user.password, password))

    if (!isValid) {
      return null
    }

    return plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    })
  }

  public async login(user: UserDto, userAgent: string): Promise<LoginUserDto> {
    const { accessToken, refreshToken } = await this.tokens.generateTokens(user.id, userAgent)

    const transformUser = { ...user, accessToken, refreshToken }

    return plainToInstance(LoginUserDto, transformUser, {
      excludeExtraneousValues: true,
    })
  }
  public async registration(dto: CreateUserRequestDto): Promise<UserDto> {
    const user = await this.users.create(dto)

    return plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    })
  }
  public async rotateRefresh(userId: string, currentRefresh: string, userAgent: string): Promise<TokensDto> {
    const tokens = await this.tokens.rotate(userId, currentRefresh, userAgent)

    return plainToInstance(TokensDto, tokens, {
      excludeExtraneousValues: true,
    })
  }

  public async logout(userId: string): Promise<void> {
    await this.tokens.revokeAll(userId)
  }
}
