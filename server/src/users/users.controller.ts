import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Get,
  NotFoundException,
} from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { USER_ROUTES } from './constants/users.routes'
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard'
import { CreateUserRequestDto } from './dto/req/create-user-req.dto'
import { CreateUserResponseDto } from './dto/res/create-user-response.dto'
import { ProfileResponseDto } from './dto/req/profile-response.dto'

@Controller(USER_ROUTES.ROOT)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() dto: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    const user = await this.usersService.create(dto)
    return { message: 'User successfully created', data: { id: user.id } }
  }

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
