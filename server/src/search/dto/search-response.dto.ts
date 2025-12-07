import { Expose, Type } from 'class-transformer'
import { HouseDto } from 'src/houses/dto/house.dto'
import { ContractDto } from 'src/contracts/dto/contract.dto'
import { RenterDto } from 'src/renters/dto/renter.dto'

export class SearchResponseDto {
  @Expose()
  @Type(() => HouseDto)
  houses: HouseDto[]

  @Expose()
  @Type(() => RenterDto)
  renters: RenterDto[]

  @Expose()
  @Type(() => ContractDto)
  contracts: ContractDto[]
}
