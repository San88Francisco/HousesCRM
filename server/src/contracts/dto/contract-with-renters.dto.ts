import { Expose, Type, Transform } from 'class-transformer'
import { ContractDto } from './contract.dto'
import { RenterDto } from 'src/renters/dto/renter.dto'

export class ContractWithRentersDto extends ContractDto {
  @Expose()
  @Transform(({ value }: { value?: RenterDto }) => (value?.id ? value : null))
  @Type(() => RenterDto)
  renter: RenterDto | null
}
