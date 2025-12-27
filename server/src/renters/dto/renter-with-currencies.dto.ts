import { Expose, Type } from 'class-transformer'
import { ContractStatus } from 'src/contracts/entities/contract.entity'
import { AmountInCurrencyDto } from 'src/exchange-rates/dto/amount-with-currencies.dto'

/**
 * DTO для орендаря з конвертацією доходу у всі валюти
 */
export class RenterWithCurrenciesDto {
  @Expose()
  id: string

  @Expose()
  firstName: string

  @Expose()
  lastName: string

  @Expose()
  age: number

  @Expose()
  occupied: Date | null

  @Expose()
  vacated?: Date | null

  @Expose()
  totalIncome: number

  @Expose()
  @Type(() => AmountInCurrencyDto)
  totalIncomeInCurrencies: AmountInCurrencyDto[]

  @Expose()
  status: ContractStatus
}
