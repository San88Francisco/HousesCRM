import { IsEmail, MinLength, Matches, IsDefined } from 'class-validator'
import { VALIDATION_PATTERNS } from 'src/common/constants/validation.constant'

export class CreateUserDto {
  @IsDefined({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  public readonly email: string

  @IsDefined({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  public readonly password: string

  @IsDefined({ message: 'Username is required' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @Matches(VALIDATION_PATTERNS.USERNAME, {
    message: 'Username can only contain letters, numbers and underscore',
  })
  public readonly username: string
}
