import { Expose, Type } from 'class-transformer'
import { HouseDetailAnalyticDto } from 'src/analytics/house-detail-analytics/dto/house-detail-analytic.dto'
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto'

export class HouseOccupancyReportResponseDto {
  @Expose()
  @Type(() => HouseDetailAnalyticDto)
  data: HouseDetailAnalyticDto[]

  @Expose()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto
}
