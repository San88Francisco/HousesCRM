import { Expose, Type } from 'class-transformer'
import { HouseDetailAnalyticDto } from './house-detail-analytic.dto'
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto'

export class HouseDetailAnalyticResponseDto {
  @Expose()
  @Type(() => HouseDetailAnalyticDto)
  public data: HouseDetailAnalyticDto[]

  @Expose()
  @Type(() => PaginationMetaDto)
  public meta: PaginationMetaDto
}
