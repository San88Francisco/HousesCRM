import { Expose, Type } from 'class-transformer'
import { ContractStatus } from '../entities/contract.entity'
import { CurrencyCode } from 'src/exchange-rates/entities/exchange-rate.entity'
import { PeriodCurrenciesDto } from './contract-period-currencies.dto'

/**
 * DTO для контракту з конвертацією платежу у всі валюти
 * Розбито на періоди по 3 місяці з курсами для кожного періоду
 */
export class ContractWithCurrenciesDto {
  @Expose()
  id: string

  @Expose()
  commencement: Date

  @Expose()
  termination: Date

  @Expose()
  status: ContractStatus

  @Expose()
  monthlyPayment: number

  @Expose()
  paymentCurrency: CurrencyCode

  @Expose()
  @Type(() => PeriodCurrenciesDto)
  monthlyPaymentInCurrencies: PeriodCurrenciesDto[]
}
