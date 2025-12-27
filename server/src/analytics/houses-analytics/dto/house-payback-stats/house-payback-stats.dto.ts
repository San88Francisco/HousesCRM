import { PickType } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { HouseDto } from 'src/houses/dto/house.dto'
import { AmountInCurrencyDto } from 'src/exchange-rates/dto/amount-with-currencies.dto'

export class HousePaybackStatsDto extends PickType(HouseDto, ['id', 'apartmentName', 'purchaseDate'] as const) {
  @Expose()
  purchasePrice: number

  @Expose()
  @Type(() => AmountInCurrencyDto)
  purchasePriceInCurrencies: AmountInCurrencyDto[]

  @Expose()
  totalIncome: number

  @Expose()
  @Type(() => AmountInCurrencyDto)
  totalIncomeInCurrencies: AmountInCurrencyDto[]

  @Expose()
  paybackCoefficient: number
}
