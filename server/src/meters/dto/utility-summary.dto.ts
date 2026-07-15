import { Expose, Type } from 'class-transformer'
import { UtilityType } from '../entities/utility-type.enum'

export class UtilitySummaryMonthDto {
  @Expose()
  month: string

  @Expose()
  total: number

  @Expose()
  costs: Partial<Record<UtilityType, number>>
}

export class UtilitySummaryResponseDto {
  @Expose()
  @Type(() => UtilitySummaryMonthDto)
  data: UtilitySummaryMonthDto[]
}
