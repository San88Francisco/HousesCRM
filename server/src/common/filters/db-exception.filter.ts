import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { Response } from 'express'
import { QueryFailedError } from 'typeorm'
import type { PostgresDriverError } from 'types'
import { DATABASE_ERRORS } from 'src/common/constants/database-errors.constant'

@Catch(QueryFailedError)
export class DbExceptionFilter implements ExceptionFilter {
  public catch(exception: QueryFailedError, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>()

    const driver = exception.driverError as unknown as PostgresDriverError

    const mapped = Object.values(DATABASE_ERRORS).find((e) => e.code === driver.code)

    if (mapped) {
      res.status(mapped.status).json({
        message: mapped.message,
      })
      return
    }

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Unexpected database error',
    })
  }
}
