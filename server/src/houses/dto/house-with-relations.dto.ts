import { Expose, Type } from 'class-transformer'
import { HouseDto } from './house.dto'
import { HousePriceDto } from 'src/house-prices/dto/house-price.dto'
import { ContractWithRentersDto } from 'src/contracts/dto/contract-with-renters.dto'

export class HouseWithRelationsDto extends HouseDto {
  @Expose()
  @Type(() => HousePriceDto)
  public prices: HousePriceDto[]

  @Expose()
  @Type(() => ContractWithRentersDto)
  public contracts: ContractWithRentersDto[]
}
