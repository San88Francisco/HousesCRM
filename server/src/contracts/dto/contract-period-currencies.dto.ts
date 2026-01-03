import { Expose, Type } from 'class-transformer'
import { AmountInCurrencyDto } from 'src/exchange-rates/dto/amount-with-currencies.dto'

/**
 * DTO для періоду контракту (3 місяці)
 */
export class ContractPeriodDto {
  @Expose()
  from: Date

  @Expose()
  to: Date
}

/**
 * DTO для валют в конкретному періоді
 */
export class PeriodCurrenciesDto {
  @Expose()
  @Type(() => ContractPeriodDto)
  period: ContractPeriodDto

  @Expose()
  @Type(() => AmountInCurrencyDto)
  currencies: AmountInCurrencyDto[]
}
