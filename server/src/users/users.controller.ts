import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { UsersService } from './users.service'
import { USER_ROUTES } from './constants/users.routes'
import { CreateUserDto } from './dto/createUser.dto'

interface CreateUserResponse {
  message: string
  data: { id: string }
}

@Controller(USER_ROUTES.ROOT)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() dto: CreateUserDto): Promise<CreateUserResponse> {
    const user = await this.usersService.create(dto)
    return { message: 'User successfully created', data: { id: user.id } }
  }
}
