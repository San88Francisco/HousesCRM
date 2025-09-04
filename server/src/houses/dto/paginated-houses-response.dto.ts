import { Expose, Type } from 'class-transformer'
import { HouseDto } from './house.dto'
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto'

export class PaginatedHouseResponseDto {
  @Expose()
  public data: HouseDto[]

  @Expose()
  @Type(() => PaginationMetaDto)
  public meta: PaginationMetaDto
}
