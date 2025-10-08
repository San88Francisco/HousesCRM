import {
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  Body,
  Get,
  UnauthorizedException,
} from '@nestjs/common'
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
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response
  ): Promise<LoginUserResponseDto> {
    const ua = req.headers['user-agent']
    const userAgent: string = typeof ua === 'string' ? ua : 'unknown'

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

  @Get(AUTH_ROUTES.REFRESH)
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public async RefreshTokenModulerefresh(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response
  ): Promise<RefreshTokenResponseDto> {
    const ua = req.headers['user-agent']
    const userAgent: string = typeof ua === 'string' ? ua : 'unknown'

    const cookieName = this.config.get<string>('jwt.refreshCookie') ?? 'refresh_token'

    const rawCookie = (req as unknown as { cookies?: Record<string, unknown> }).cookies?.[cookieName]
    if (typeof rawCookie !== 'string') {
      throw new UnauthorizedException('Invalid refresh token cookie')
    }
    const currentRefresh: string = rawCookie

    const { accessToken, refreshToken } = await this.authService.rotateRefresh(req.user.id, currentRefresh, userAgent)
    this.setRefreshCookie(res, refreshToken)
    return { accessToken }
  }

  @Post(AUTH_ROUTES.LOGOUT)
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async logout(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ ok: true }> {
    await this.authService.logout(req.user.id)
    res.clearCookie(this.config.get<string>('jwt.refreshCookie') || 'refresh_token', {
      path: '/',
    })
    return { ok: true }
  }

  private setRefreshCookie(res: Response, token: string): void {
    const name = this.config.get<string>('jwt.refreshCookie') || 'refresh_token'
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
  public async googleAuthCallback(@Req() req: AuthenticatedRequest, @Res() res: Response): Promise<void> {
    const userAgent = req.headers['user-agent'] || 'unknown'
    const clientURL = this.config.getOrThrow<string>('FRONTEND_URL')
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
