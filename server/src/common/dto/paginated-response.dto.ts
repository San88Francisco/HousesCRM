import { Expose, Type } from 'class-transformer'
import { PaginationMetaDto } from './pagination-meta.dto'

export class PaginatedResponseDto<T> {
  @Expose()
  public data: T[]

  @Expose()
  @Type(() => PaginationMetaDto)
  public meta: PaginationMetaDto
}
