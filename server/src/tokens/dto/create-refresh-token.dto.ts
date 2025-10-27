import { Expose } from 'class-transformer'
import type { JwtPayload } from 'types/jwt/jwt.types'

export class CreateRefreshTokenDto {
  @Expose() payload: JwtPayload
  @Expose() token: string
}
