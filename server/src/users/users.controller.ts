import { Controller } from '@nestjs/common'
import { UsersService } from './users.service'
import { USER_ROUTES } from './constants/users.routes'

@Controller(USER_ROUTES.ROOT)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
