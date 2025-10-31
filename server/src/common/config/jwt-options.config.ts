import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions } from '@nestjs/jwt'
import { StringValue } from 'ms'

export const jwtOptionsFactory = (config: ConfigService): JwtModuleOptions => ({
  secret: config.get<string>('JWT_SECRET', 'dev_fallback_secret'),
  signOptions: { expiresIn: config.get<string>('JWT_EXPIRES', '30d') as StringValue | number },
})
