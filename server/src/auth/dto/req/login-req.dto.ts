import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class LoginRequestDto {
  @ApiProperty({ example: 'jane@acme.com' })
  @IsEmail()
  public email!: string

  @ApiProperty({ example: 'StrongP@ssw0rd!', format: 'password' })
  @IsString()
  public password!: string
}
