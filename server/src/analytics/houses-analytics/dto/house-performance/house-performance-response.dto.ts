import { Expose, Type } from 'class-transformer'
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto'
import { HousePerformanceDto } from './house-performance.dto'

export class HousePerformanceResponseDto {
  @Expose()
  @Type(() => HousePerformanceDto)
  public data: HousePerformanceDto[]

  @Expose()
  @Type(() => PaginationMetaDto)
  public meta: PaginationMetaDto
}
