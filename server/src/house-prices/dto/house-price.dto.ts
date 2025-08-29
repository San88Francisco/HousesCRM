import { Expose } from 'class-transformer'
import { CurrencyCode } from '../enums/currency-code.enum'

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
