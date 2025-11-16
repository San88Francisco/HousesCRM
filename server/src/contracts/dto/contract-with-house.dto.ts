import { Expose, Type, Transform } from 'class-transformer'
import { HouseDto } from 'src/houses/dto/house.dto'
import { ContractDto } from './contract.dto'

export class ContractWithHouseDto extends ContractDto {
  @Expose()
  @Transform(({ value }: { value?: HouseDto }) => (value?.id ? value : null))
  @Type(() => HouseDto)
  house: HouseDto | null
}
