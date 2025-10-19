import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20'
import { AuthService } from '../auth.service'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['profile', 'email'],
    })
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile, cb: VerifyCallback): Promise<void> {
    const { _json } = profile
    const user = await this.authService.LoginWithGoogle({
      email: _json.email as string,
      googleId: _json.sub,
      username: _json.name as string,
    })

    return cb(null, user)
  }
}
