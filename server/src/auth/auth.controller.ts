import { Controller, Post, UseGuards, HttpCode, HttpStatus, Req, Body } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { AUTH_ROUTES } from './constants/auth.routes'
import { LocalAuthGuard } from './guard/local-auth.guard'
import { LoginRequestDto } from './dto/req/login-req.dto'
import { LoginResponseDto } from './dto/res/login-res.dto'
import { type AuthenticatedRequest } from './types'

@ApiTags('auth')
@Controller(AUTH_ROUTES.ROOT)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(AUTH_ROUTES.LOGIN)
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async login(@Body() _dto: LoginRequestDto, @Req() req: AuthenticatedRequest): Promise<LoginResponseDto> {
    return this.authService.login(req.user)
  }
}
