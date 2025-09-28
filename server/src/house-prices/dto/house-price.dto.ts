import { Expose } from 'class-transformer'
import { CurrencyCode } from '../entities/house-price.entity'

export class HousePriceDto {
  @Expose()
  public id: string

  @Expose()
  public amount: number

  @Expose()
  public code: CurrencyCode

  @Expose()
  public exchangeRate: number
}
