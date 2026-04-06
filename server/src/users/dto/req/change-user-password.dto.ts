import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'

export class ChangeUserPasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(1, { message: 'Поточний пароль обов’язковий' })
  currentPassword!: string

  @ApiProperty()
  @IsString()
  @MinLength(6, { message: 'Новий пароль має містити щонайменше 6 символів' })
  newPassword!: string
}
