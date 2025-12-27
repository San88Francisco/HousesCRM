import { PickType } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { ContractDto } from 'src/contracts/dto/contract.dto'
import { RenterSubsetDto } from './renter-subset.dto'
import { PeriodCurrenciesDto } from 'src/contracts/dto/contract-period-currencies.dto'

export class ContractSubsetDto extends PickType(ContractDto, [
  'id',
  'commencement',
  'termination',
  'monthlyPayment',
] as const) {
  @Expose()
  @Type(() => RenterSubsetDto)
  renter: RenterSubsetDto

  @Expose()
  @Type(() => PeriodCurrenciesDto)
  monthlyPaymentInCurrencies: PeriodCurrenciesDto[]
}
