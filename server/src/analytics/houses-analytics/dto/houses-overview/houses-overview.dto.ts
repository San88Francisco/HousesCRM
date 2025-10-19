import { PickType } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { HouseDto } from 'src/houses/dto/house.dto'
import { ContractSubsetDto } from './contract-subset.dto'

export class HouseOverviewDto extends PickType(HouseDto, ['id', 'apartmentName'] as const) {
  @Expose()
  @Type(() => ContractSubsetDto)
  contract: ContractSubsetDto[]
}
