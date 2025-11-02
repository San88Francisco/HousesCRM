import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt'

export const jwtOptionsFactory = (config: ConfigService): JwtModuleOptions => ({
  secret: config.get<string>('JWT_SECRET', 'dev_fallback_secret'),
  signOptions: {
    expiresIn: config.get<JwtSignOptions['expiresIn']>('JWT_EXPIRES', '30d'),
  },
})
