import { Body, Controller, Post } from '@nestjs/common'
import { UsersService } from './users.service'
import { USER_ROUTES } from './constants/users.routes'
import { CreateUserDto } from './dto/createUser.dto'

@Controller(USER_ROUTES.ROOT)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(USER_ROUTES.CREATE)
  public create(@Body() createUserDto: CreateUserDto): Promise<{ mes: string }> {
    return this.usersService.create(createUserDto)
  }
}
