import { Expose } from 'class-transformer'
import { UserDto } from './user.dto'

export class UserWithPasswordDto extends UserDto {
  @Expose() password: string
}
