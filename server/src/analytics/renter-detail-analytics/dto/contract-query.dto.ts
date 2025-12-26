import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsIn, IsInt, IsOptional, IsPositive, Min } from 'class-validator'
import { SortOrder } from 'src/common/enums/sort-order.enum'
import { ContractWithRevenueDto } from './contract-with-revenue.dto'

export type ContractSortBy = Exclude<keyof ContractWithRevenueDto, 'id'>

export const CONTRACT_SORT_BY_FIELDS: ContractSortBy[] = [
  'commencement',
  'termination',
  'monthlyPayment',
  'status',
  'totalRevenue',
]

export class ContractQueryDto {
  @ApiPropertyOptional({
    enum: CONTRACT_SORT_BY_FIELDS,
    example: 'commencement',
    description: 'Field to sort by (fields from ContractWithRevenueDto except id)',
  })
  @IsOptional()
  @IsIn(CONTRACT_SORT_BY_FIELDS)
  sortBy?: ContractSortBy = 'commencement'

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
