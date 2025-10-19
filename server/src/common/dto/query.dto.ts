import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, IsPositive, Min } from 'class-validator'
import { SortOrder } from '../enums/sort-order.enum'
import { HousePerformanceSortBy } from '../enums/house-performance-sort-by'

export class QueryDto {
  @ApiPropertyOptional({
    enum: HousePerformanceSortBy,
    example: HousePerformanceSortBy.TOTAL_REVENUE,
  })
  @IsOptional()
  @IsEnum(HousePerformanceSortBy)
  sortBy?: HousePerformanceSortBy = HousePerformanceSortBy.APARTMENT_NAME

  @ApiPropertyOptional({
    enum: SortOrder,
    example: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.DESC

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number = 10
}
