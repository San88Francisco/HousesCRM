import { Expose } from 'class-transformer'

export class TokensDto {
  @Expose() public accessToken: string
  @Expose() public refreshToken: string
}
