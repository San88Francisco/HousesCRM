import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Min } from 'class-validator'
import { QUERY_DEFAULTS } from 'src/common/constants/query.constant'
import { SortOrder } from 'src/common/enums/sort-order.enum'
import { HouseOccupancySortField } from '../constants/house-occupancy-sort-field'
import { ContractStatus } from 'src/contracts/entities/contract.entity'

export class HouseOccupancyQueryDto {
  @ApiPropertyOptional({ enum: HouseOccupancySortField })
  @IsOptional()
  @IsEnum(HouseOccupancySortField)
  sortBy?: HouseOccupancySortField = HouseOccupancySortField.TOTAL_INCOME

  @ApiPropertyOptional({ enum: SortOrder })
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

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID('4')
  id?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  renterName?: string

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  occupiedFrom?: Date

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  occupiedTo?: Date

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  vacatedFrom?: Date

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  vacatedTo?: Date

  @ApiPropertyOptional({ enum: ContractStatus })
  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minTotalIncome?: number

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxTotalIncome?: number
}
