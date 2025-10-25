import { Expose } from 'class-transformer'

export class RefreshTokenDto {
  @Expose() public hashedToken: string
  @Expose() public expiresAt: string
  @Expose() public userAgent: string
}
