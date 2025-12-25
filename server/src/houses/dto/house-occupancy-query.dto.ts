import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsIn, IsInt, IsOptional, IsPositive, Min } from 'class-validator'
import { QUERY_DEFAULTS } from 'src/common/constants/query.constant'
import { SortOrder } from 'src/common/enums/sort-order.enum'
import { RenterDto } from 'src/renters/dto/renter.dto'

export type HouseOccupancySortBy = Exclude<keyof RenterDto, 'id'>

export const HOUSE_OCCUPANCY_SORT_BY_FIELDS: HouseOccupancySortBy[] = [
  'firstName',
  'lastName',
  'occupied',
  'vacated',
  'totalIncome',
  'status',
]

export class HouseOccupancyQueryDto {
  @ApiPropertyOptional({
    enum: HOUSE_OCCUPANCY_SORT_BY_FIELDS,
    example: 'totalIncome',
    description: 'Field to sort by (fields from RenterDto except id)',
  })
  @IsOptional()
  @IsIn(HOUSE_OCCUPANCY_SORT_BY_FIELDS)
  sortBy?: HouseOccupancySortBy = 'totalIncome'

  @ApiPropertyOptional({
    enum: SortOrder,
    example: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.DESC

  @ApiPropertyOptional({ example: QUERY_DEFAULTS.PAGE })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = QUERY_DEFAULTS.PAGE

  @ApiPropertyOptional({ example: QUERY_DEFAULTS.LIMIT })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number = QUERY_DEFAULTS.LIMIT
}
