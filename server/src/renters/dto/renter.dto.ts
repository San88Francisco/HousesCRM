import { Expose } from 'class-transformer'
import { ContractStatus } from 'src/contracts/entities/contract.entity'

export class RenterDto {
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
  status: ContractStatus
}
