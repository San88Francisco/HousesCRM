import type { Request } from 'express'
import { UserDto } from 'src/users/dto/res/user.dto'
import { JwtPayload } from 'types/jwt/jwt.types'

export interface AuthenticatedRequest<T extends Express.User = JwtPayload | UserDto> extends Request {
  user: T
}
