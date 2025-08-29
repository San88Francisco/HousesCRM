import { Expose, Type } from 'class-transformer'
import { HouseDto } from 'src/houses/dto/house.dto'
import { ContractDto } from './contract.dto'

export class ContractWithHouseDto extends ContractDto {
  @Expose()
  @Type(() => HouseDto)
  public house: HouseDto
}
