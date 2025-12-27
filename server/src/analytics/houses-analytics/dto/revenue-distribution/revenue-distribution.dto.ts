import { PickType } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { HouseDto } from 'src/houses/dto/house.dto'
import { AmountInCurrencyDto } from 'src/exchange-rates/dto/amount-with-currencies.dto'

export class RevenueDistributionItemDto extends PickType(HouseDto, ['id', 'apartmentName'] as const) {
  @Expose()
  @Type(() => Number)
  apartmentTotalRevenue: number

  @Expose()
  @Type(() => AmountInCurrencyDto)
  apartmentTotalRevenueInCurrencies: AmountInCurrencyDto[]

  @Expose()
  @Type(() => Number)
  percentage: number
}

export class RevenueDistributionDto {
  @Expose()
  @Type(() => RevenueDistributionItemDto)
  data: RevenueDistributionItemDto[]

  @Expose()
  @Type(() => Number)
  grandTotal: number

  @Expose()
  @Type(() => AmountInCurrencyDto)
  grandTotalInCurrencies: AmountInCurrencyDto[]
}
