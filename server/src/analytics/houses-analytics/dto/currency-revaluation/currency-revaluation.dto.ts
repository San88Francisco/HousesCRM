import { PickType } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import { HouseDto } from 'src/houses/dto/house.dto'
import { AmountInCurrencyDto } from 'src/exchange-rates/dto/amount-with-currencies.dto'

export class CurrencyRevaluationDto extends PickType(HouseDto, ['id', 'apartmentName'] as const) {
  @Expose()
  @Transform(({ value }) => parseFloat(Number(value).toFixed(2)))
  purchaseRate: number

  @Expose()
  @Transform(({ value }) => parseFloat(Number(value).toFixed(2)))
  currentRate: number

  @Expose()
  @Transform(({ value }) => Math.round(Number(value)))
  revaluationAmount: number

  @Expose()
  @Type(() => AmountInCurrencyDto)
  revaluationAmountInCurrencies: AmountInCurrencyDto[]

  @Expose()
  @Transform(({ value }) => parseFloat(Number(value).toFixed(2)))
  purchaseAmount: number

  @Expose()
  @Type(() => AmountInCurrencyDto)
  purchaseAmountInCurrencies: AmountInCurrencyDto[]
}
