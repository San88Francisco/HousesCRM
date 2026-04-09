import { Body, Controller, Get, NotFoundException, Patch, Request, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { USER_ROUTES } from './constants/users.routes'
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard'
import { ProfileResponseDto } from './dto/req/profile-response.dto'
import { UpdateUserProfileDto } from './dto/req/update-user-profile.dto'
import { ChangeUserPasswordDto } from './dto/req/change-user-password.dto'
import { JwtPayload } from 'types/jwt/jwt.types'

@Controller(USER_ROUTES.ROOT)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getProfile(@Request() req: { user: JwtPayload }): Promise<ProfileResponseDto> {
    const user = await this.usersService.findById(req.user.sub)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      contractPdfProfile: user.contractPdfProfile ?? null,
    }
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateProfile(
    @Request() req: { user: JwtPayload },
    @Body() dto: UpdateUserProfileDto
  ): Promise<ProfileResponseDto> {
    const user = await this.usersService.updateProfile(req.user.sub, dto)
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      contractPdfProfile: user.contractPdfProfile ?? null,
    }
  }

  @Patch('password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async changePassword(
    @Request() req: { user: JwtPayload },
    @Body() dto: ChangeUserPasswordDto
  ): Promise<{ ok: boolean }> {
    await this.usersService.changePassword(req.user.sub, dto.currentPassword, dto.newPassword)
    return { ok: true }
  }
}
