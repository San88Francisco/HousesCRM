import { Expose } from 'class-transformer'
import { RenterDto } from 'src/renters/dto/renter.dto'
import { ContractStatus } from 'src/contracts/entities/contract.entity'

export class HouseDetailAnalyticDto extends RenterDto {
  @Expose()
  totalIncome: number

  @Expose()
  status: ContractStatus
}
