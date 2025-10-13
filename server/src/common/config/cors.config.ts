import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { ConfigService } from '@nestjs/config'

export const corsConfig = (configService: ConfigService<unknown, boolean>): CorsOptions => ({
  origin: [configService.getOrThrow<string>('FRONTEND_DEV_URL'), configService.getOrThrow<string>('FRONTEND_PROD_URL')],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
})
