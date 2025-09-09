import { Expose, Type, Transform } from 'class-transformer'
import { HouseDto } from 'src/houses/dto/house.dto'
import { RenterDto } from 'src/renters/dto/renter.dto'
import { ContractDto } from './contract.dto'

export class ContractWithRelationsDto extends ContractDto {
  @Expose()
  @Transform(({ value }: { value?: RenterDto }) => (value?.id ? value : null))
  @Type(() => RenterDto)
  public renter: RenterDto | null

  @Expose()
  @Transform(({ value }: { value?: HouseDto }) => (value?.id ? value : null))
  @Type(() => HouseDto)
  public house: HouseDto | null
}
