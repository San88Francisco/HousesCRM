import { Expose, Type } from 'class-transformer'
import { AmountInCurrencyDto } from 'src/exchange-rates/dto/amount-with-currencies.dto'

export class HousePerformanceDto {
  @Expose()
  apartmentName: string

  @Expose()
  rentersCount: number

  @Expose()
  totalRevenue: number

  @Expose()
  @Type(() => AmountInCurrencyDto)
  totalRevenueInCurrencies: AmountInCurrencyDto[]

  @Expose()
  currentPayment: number

  @Expose()
  @Type(() => AmountInCurrencyDto)
  currentPaymentInCurrencies: AmountInCurrencyDto[]
}
