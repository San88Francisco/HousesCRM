import { Expose, Type } from 'class-transformer'
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto'
import { RenterDto } from 'src/renters/dto/renter.dto'

export class HouseOccupancyReportResponseDto {
  @Expose()
  @Type(() => RenterDto)
  data: RenterDto[]

  @Expose()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto
}
