import { Expose } from 'class-transformer'

export class RefreshTokenDto {
  @Expose() hashedToken: string
  @Expose() expiresAt: string
  @Expose() userAgent: string
}
