import { Expose, Type } from 'class-transformer'
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto'
import { RenterWithCurrenciesDto } from './renter-with-currencies.dto'

export class RenterResponseDto {
  @Expose()
  @Type(() => RenterWithCurrenciesDto)
  data: RenterWithCurrenciesDto[]

  @Expose()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto
}
