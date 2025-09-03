import { Expose, Type } from 'class-transformer'
import { RenterDto } from './renter.dto'
import { ContractWithHouseDto } from 'src/contracts/dto/contract-with-house.dto'

export class RenterWithContractDto extends RenterDto {
  @Expose()
  @Type(() => ContractWithHouseDto)
  public contracts: ContractWithHouseDto[]
}
