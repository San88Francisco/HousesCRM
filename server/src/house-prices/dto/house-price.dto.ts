import { Expose } from 'class-transformer'
import { CurrencyCode } from '../entities/house-price.entity'

export class HousePriceDto {
  @Expose()
  id: string

  @Expose()
  amount: number

  @Expose()
  code: CurrencyCode

  @Expose()
  exchangeRate: number
}
