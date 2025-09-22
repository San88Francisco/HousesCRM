import { Controller, UseGuards, Request, Get, NotFoundException } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { USER_ROUTES } from './constants/users.routes'
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard'
import { ProfileResponseDto } from './dto/req/profile-response.dto'

@Controller(USER_ROUTES.ROOT)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  public async getProfile(@Request() req: { user: { email: string } }): Promise<ProfileResponseDto> {
    const user = await this.usersService.findOne(req.user.email)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return { id: user.id, email: user.email }
  }
}
