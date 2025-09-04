import { Expose, Type } from 'class-transformer'
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto'
import { RenterDto } from './renter.dto'

export class PaginatedRenterResponseDto {
  @Expose()
  public data: RenterDto[]

  @Expose()
  @Type(() => PaginationMetaDto)
  public meta: PaginationMetaDto
}
