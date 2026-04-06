import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateUserProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail({}, { message: 'Некоректний формат електронної пошти' })
  email?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(3, { message: "Ім'я користувача має містити щонайменше 3 символи" })
  username?: string
}
