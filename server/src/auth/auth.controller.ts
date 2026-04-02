import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation } from '@nestjs/swagger'
import type { Response } from 'express'
import { Public } from 'src/common/decorators/public.decorator'
import { CreateUserRequestDto } from 'src/users/dto/req/create-user-req.dto'
import { CreateUserResponseDto } from 'src/users/dto/res/create-user-response.dto'
import { LoginUserResponseDto } from 'src/users/dto/res/login-user-res.dto'
import { UserDto } from 'src/users/dto/res/user.dto'
import { JwtPayload } from 'types/jwt/jwt.types'
import { AuthService } from './auth.service'
import { AUTH_ROUTES } from './constants/auth.routes'
import { LoginRequestDto } from './dto/req/login-req.dto'
import { LogoutDto } from './dto/res/logout.dto'
import { RefreshTokenResponseDto } from './dto/res/refresh-token.dto'
import { GoogleAuthGuard } from './guard/google-auth.guard'
import { type AuthenticatedRequest } from './types'

@Controller(AUTH_ROUTES.ROOT)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService
  ) {}

  @Post(AUTH_ROUTES.LOGIN)
  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Public()
  async login(
    @Body() _dto: LoginRequestDto,
    @Req() req: AuthenticatedRequest<UserDto>,
    @Res({ passthrough: true }) res: Response
  ): Promise<LoginUserResponseDto> {
    const userAgent = req.headers['user-agent'] || 'unknown'

    const { refreshToken, ...user } = await this.authService.login(req.user, userAgent)
    this.setRefreshCookie(res, refreshToken)
    return user
  }

  @Public()
  @Post(AUTH_ROUTES.REGISTRATION)
  // @Auth()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    const user = await this.authService.registration(dto)
    return { message: 'User successfully created', data: { id: user.id } }
  }

  @Public()
  @Post(AUTH_ROUTES.REFRESH)
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async rotateRefresh(
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
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async logout(
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
      sameSite: 'none',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
  }

  @ApiOperation({
    summary: 'Redirects user to Google OAuth page',
    description: 'Frontend should navigate user here to start OAuth login. No request body and no response expected.',
  })
  @Public()
  @Get(AUTH_ROUTES.GOOGLE)
  @UseGuards(GoogleAuthGuard)
  async googleAuth(): Promise<void> {}

  @ApiExcludeEndpoint()
  @Public()
  @Get(AUTH_ROUTES.GOOGLE_CALLBACK)
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: AuthenticatedRequest<UserDto>, @Res() res: Response): Promise<void> {
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
      sameSite: 'none',
    })

    return res.redirect(clientURL)
  }
}
