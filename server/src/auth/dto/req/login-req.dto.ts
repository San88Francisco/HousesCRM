import { IsEmail, IsString } from 'class-validator'

export class LoginRequestDto {
  @IsEmail()
  public email!: string

  @IsString()
  public password!: string
}
