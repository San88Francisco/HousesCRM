import { IsEmail, MinLength, IsDefined } from 'class-validator'

export class CreateUserRequestDto {
  @IsDefined({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string

  @IsDefined({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  readonly password: string

  @IsDefined({ message: 'Username is required' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  readonly username: string
}
