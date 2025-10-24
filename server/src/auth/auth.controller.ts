import { Controller, Post, UseGuards, HttpCode, HttpStatus, Req, Res, Body, Get } from '@nestjs/common'
import type { Response } from 'express'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { AUTH_ROUTES } from './constants/auth.routes'
import { LoginRequestDto } from './dto/req/login-req.dto'
import { type AuthenticatedRequest } from './types'
import { ConfigService } from '@nestjs/config'
import { LoginUserResponseDto } from 'src/users/dto/res/login-user-res.dto'
import { CreateUserRequestDto } from 'src/users/dto/req/create-user-req.dto'
import { CreateUserResponseDto } from 'src/users/dto/res/create-user-response.dto'
import { RefreshTokenResponseDto } from './dto/res/refresh-token.dto'
import { GoogleAuthGuard } from './guard/google-auth.guard'
import { ApiExcludeEndpoint, ApiOperation } from '@nestjs/swagger'
import { JwtPayload } from 'types/jwt/jwt.types'
import { UserDto } from 'src/users/dto/res/user.dto'
import { LogoutDto } from './dto/res/logout.dto'

@Controller(AUTH_ROUTES.ROOT)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService
  ) {}

  @Post(AUTH_ROUTES.LOGIN)
  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() _dto: LoginRequestDto,
    @Req() req: AuthenticatedRequest<UserDto>,
    @Res({ passthrough: true }) res: Response
  ): Promise<LoginUserResponseDto> {
    const userAgent = req.headers['user-agent'] || 'unknown'

    const { refreshToken, ...user } = await this.authService.login(req.user, userAgent)
    this.setRefreshCookie(res, refreshToken)
    return user
  }

  @Post(AUTH_ROUTES.REGISTRATION)
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() dto: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    const user = await this.authService.registration(dto)
    return { message: 'User successfully created', data: { id: user.id } }
  }

  @Post(AUTH_ROUTES.REFRESH)
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public async rotateRefresh(
    @Req() req: AuthenticatedRequest<JwtPayload>,
    @Res({ passthrough: true }) res: Response
  ): Promise<RefreshTokenResponseDto> {
    const userAgent = req.headers['user-agent'] || 'unknown'

    const { accessToken, refreshToken } = await this.authService.rotateRefresh(req.user.sub, userAgent)
    this.setRefreshCookie(res, refreshToken)
    return { accessToken }
  }

  @Post(AUTH_ROUTES.LOGOUT)
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async logout(
    @Req() req: AuthenticatedRequest<JwtPayload>,
    @Res({ passthrough: true }) res: Response
  ): Promise<LogoutDto> {
    await this.authService.logout(req.user.sub, req.user.userAgent)

    res.clearCookie(this.config.getOrThrow<string>('jwt.refreshCookie'), {
      path: '/',
    })

    return { ok: true }
  }

  private setRefreshCookie(res: Response, token: string): void {
    const name = this.config.getOrThrow<string>('jwt.refreshCookie')

    res.cookie(name, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
  }

  @ApiOperation({
    summary: 'Redirects user to Google OAuth page',
    description: 'Frontend should navigate user here to start OAuth login. No request body and no response expected.',
  })
  @Get(AUTH_ROUTES.GOOGLE)
  @UseGuards(GoogleAuthGuard)
  public async googleAuth(): Promise<void> {}

  @ApiExcludeEndpoint()
  @Get(AUTH_ROUTES.GOOGLE_CALLBACK)
  @UseGuards(GoogleAuthGuard)
  public async googleAuthCallback(@Req() req: AuthenticatedRequest<UserDto>, @Res() res: Response): Promise<void> {
    const userAgent = req.headers['user-agent'] || 'unknown'
    const nodeEnv = this.config.getOrThrow<string>('NODE_ENV')
    const frontendDevURL = this.config.getOrThrow<string>('FRONTEND_DEV_URL')
    const frontendProdURL = this.config.getOrThrow<string>('FRONTEND_PROD_URL')
    const clientURL = nodeEnv === 'development' ? frontendDevURL : frontendProdURL
    const cookieName = this.config.getOrThrow<string>('JWT_ACCESS_COOKIE')

    const { accessToken, refreshToken } = await this.authService.login(req.user, userAgent)

    this.setRefreshCookie(res, refreshToken)

    res.cookie(cookieName, accessToken, {
      httpOnly: false,
      path: '/',
      maxAge: 15 * 60 * 1000,
    })

    return res.redirect(clientURL)
  }
}
