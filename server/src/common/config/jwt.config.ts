import { registerAs } from '@nestjs/config'
import type { StringValue } from 'ms'

const req = (k: string): string => {
  const v = process.env[k]
  if (typeof v === 'string' && v.length) {
    return v
  }
  throw new Error(`Missing env ${k}`)
}

export default registerAs('jwt', () => ({
  accessSecret: req('JWT_SECRET'),
  accessExp: (process.env.JWT_EXPIRES ?? '15m') as StringValue | number,
  refreshSecret: req('JWT_REFRESH_SECRET'),
  refreshExp: (process.env.JWT_REFRESH_EXPIRES ?? '30d') as StringValue | number,
  refreshCookie: process.env.JWT_REFRESH_COOKIE ?? 'refresh_token',
}))
