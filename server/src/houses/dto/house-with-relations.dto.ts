import { Expose, Type } from 'class-transformer'
import { HouseDto } from './house.dto'
import { HousePriceCalculatedDto } from './house-price-calculated.dto'
import { ContractWithRentersDto } from 'src/contracts/dto/contract-with-renters.dto'

export class HouseWithRelationsDto extends HouseDto {
  @Expose()
  @Type(() => HousePriceCalculatedDto)
  prices: HousePriceCalculatedDto[]

  @Expose()
  @Type(() => ContractWithRentersDto)
  contracts: ContractWithRentersDto[]
}
