import { HttpStatus } from '@nestjs/common'
import { DatabaseError } from 'types'

export const DATABASE_ERRORS: Record<string, DatabaseError> = {
  UNIQUE_VIOLATION: {
    code: '23505',
    message: 'Entity with this value already exists',
    status: HttpStatus.BAD_REQUEST,
  },
  FOREIGN_KEY_VIOLATION: {
    code: '23503',
    status: HttpStatus.BAD_REQUEST,
    message: 'Invalid reference: related entity does not exist',
  },
}
