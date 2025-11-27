import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard'

export function Auth(): MethodDecorator & ClassDecorator {
  return applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth())
}
