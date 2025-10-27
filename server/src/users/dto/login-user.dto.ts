import { IntersectionType } from '@nestjs/swagger'
import { TokensDto } from 'src/tokens/dto/tokens.dto'
import { UserDto } from './res/user.dto'

export class LoginUserDto extends IntersectionType(UserDto, TokensDto) {}
