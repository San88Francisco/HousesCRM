import { Expose } from 'class-transformer'
import { UserDto } from '../user.dto'
import { OmitType } from '@nestjs/swagger'

export class UserWithGoogleDto extends OmitType(UserDto, ['id']) {
  @Expose() googleId: string
}
