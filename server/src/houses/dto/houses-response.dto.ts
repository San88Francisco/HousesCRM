import { Expose, Type } from 'class-transformer'
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto'
import { HouseWithPricesDto } from './house-with-prices.dto'

export class HouseResponseDto {
  @Expose()
  public data: HouseWithPricesDto[]

  @Expose()
  @Type(() => PaginationMetaDto)
  public meta: PaginationMetaDto
}
