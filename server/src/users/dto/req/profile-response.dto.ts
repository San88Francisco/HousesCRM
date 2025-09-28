import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, IsNotEmpty } from 'class-validator'

export class ProfileResponseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public id: string

  @ApiProperty()
  @IsEmail()
  public email: string
}
