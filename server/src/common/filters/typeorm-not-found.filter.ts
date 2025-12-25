import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { Response } from 'express'
import { EntityNotFoundError } from 'typeorm'

@Catch(EntityNotFoundError)
export class TypeOrmNotFoundFilter implements ExceptionFilter {
  catch(_exception: EntityNotFoundError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    response.status(HttpStatus.NOT_FOUND).json({
      status: HttpStatus.NOT_FOUND,
      message: 'Entity not found',
    })
  }
}

export const typeOrmNotFoundFilter = new TypeOrmNotFoundFilter()
