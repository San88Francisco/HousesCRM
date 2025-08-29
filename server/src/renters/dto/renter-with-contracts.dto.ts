import { ContractDto } from 'src/contracts/dto/contract.dto'
import { Expose, Type } from 'class-transformer'
import { RenterDto } from './renter.dto'

export class RenterWithContractDto extends RenterDto {
  @Expose()
  @Type(() => ContractDto)
  public contracts: ContractDto[]
}
