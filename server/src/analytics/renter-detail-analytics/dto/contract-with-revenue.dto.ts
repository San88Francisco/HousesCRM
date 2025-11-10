import { Expose } from 'class-transformer'
import { ContractDto } from 'src/contracts/dto/contract.dto'

export class ContractWithRevenueDto extends ContractDto {
  @Expose()
  public totalRevenue: number
}
