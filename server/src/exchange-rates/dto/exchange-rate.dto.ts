import { Expose } from 'class-transformer'
import { CurrencyCode } from '../entities/exchange-rate.entity'

export class ExchangeRateDto {
  @Expose()
  id: string

  @Expose()
  date: Date

  @Expose()
  code: CurrencyCode

  @Expose()
  rate: number
}
