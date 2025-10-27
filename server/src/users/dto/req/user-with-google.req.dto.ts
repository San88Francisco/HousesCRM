import { Expose } from 'class-transformer'
import { OmitType } from '@nestjs/swagger'
import { UserDto } from '../res/user.dto'

export class UserWithGoogleDto extends OmitType(UserDto, ['id']) {
  @Expose() googleId: string
}
