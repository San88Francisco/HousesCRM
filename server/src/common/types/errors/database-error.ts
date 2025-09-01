import { HttpStatus } from '@nestjs/common'

export interface PostgresDriverError {
  code: string
  detail?: string
  constraint?: string
}
export interface DatabaseError {
  code: string
  message: string
  status: HttpStatus
}
