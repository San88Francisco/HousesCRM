import { Expose } from 'class-transformer'
import type { JwtPayload } from 'types/jwt/jwt.types'

export class CreateRefreshTokenDto {
  @Expose() public payload: JwtPayload
  @Expose() public token: string
}
