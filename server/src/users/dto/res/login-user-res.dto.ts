import { OmitType } from '@nestjs/swagger'
import { LoginUserDto } from '../login-user.dto'

export class LoginUserResponseDto extends OmitType(LoginUserDto, ['refreshToken']) {}
