import { Expose } from 'class-transformer'
import { ContractStatus } from '../entities/contract.entity'
import { CurrencyCode } from 'src/exchange-rates/entities/exchange-rate.entity'

export class ContractDto {
  @Expose()
  id: string

  @Expose()
  commencement: Date

  @Expose()
  termination: Date

  @Expose()
  monthlyPayment: number

  @Expose()
  paymentCurrency: CurrencyCode

  @Expose()
  status: ContractStatus
}
