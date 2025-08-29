import { Expose } from 'class-transformer'
import { ContractStatus } from '../enums/contract-status.enum'

export class ContractDto {
  @Expose()
  public id: string

  @Expose()
  public commencement: Date

  @Expose()
  public termination: Date

  @Expose()
  public monthlyPayment: number

  @Expose()
  public status: ContractStatus
}
