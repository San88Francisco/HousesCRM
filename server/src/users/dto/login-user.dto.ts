import { IntersectionType } from '@nestjs/swagger'
import { UserDto } from './user.dto'
import { TokensDto } from 'src/tokens/dto/tokens.dto'

export class LoginUserDto extends IntersectionType(UserDto, TokensDto) {}
