import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsIn, IsInt, IsOptional, IsPositive, Min } from 'class-validator'
import { SortOrder } from 'src/common/enums/sort-order.enum'
import { RenterDto } from './renter.dto'

export type RenterSortBy = Exclude<keyof RenterDto, 'id'>

export const RENTER_SORT_BY_FIELDS: RenterSortBy[] = [
  'firstName',
  'lastName',
  'occupied',
  'vacated',
  'totalIncome',
  'status',
]

export class RenterQueryDto {
  @ApiPropertyOptional({
    enum: RENTER_SORT_BY_FIELDS,
    example: 'occupied',
  })
  @IsOptional()
  @IsIn(RENTER_SORT_BY_FIELDS)
  sortBy?: RenterSortBy = 'occupied'

  @ApiPropertyOptional({
    enum: SortOrder,
    example: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.DESC

  @ApiPropertyOptional({ example: 1 })
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
