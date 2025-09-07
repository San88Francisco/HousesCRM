import { ApiProperty } from '@nestjs/swagger'

export class LoginResponseDto {
  @ApiProperty()
  public id!: string
  @ApiProperty()
  public email!: string
  @ApiProperty({ description: 'JWT access token' })
  public token!: string
}
