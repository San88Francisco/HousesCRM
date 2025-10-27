import { Expose } from 'class-transformer'
import { ContractStatus } from '../entities/contract.entity'

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
  status: ContractStatus
}
