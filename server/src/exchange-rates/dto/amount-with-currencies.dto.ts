import { Expose, Type } from 'class-transformer'
import { CurrencyCode } from '../entities/exchange-rate.entity'

/**
 * DTO для відображення суми у всіх валютах
 * Використовується для повернення грошей з конвертацією
 */
export class AmountInCurrencyDto {
  @Expose()
  code: CurrencyCode

  @Expose()
  amount: number

  @Expose()
  exchangeRate: number
}

export class AmountWithCurrenciesDto {
  @Expose()
  @Type(() => AmountInCurrencyDto)
  currencies: AmountInCurrencyDto[]
}
