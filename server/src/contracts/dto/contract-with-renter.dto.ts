import { Expose, Type } from 'class-transformer'
import { ContractDto } from './contract.dto'
import { RenterDto } from 'src/renters/dto/renter.dto'

export class ContractWithRenterDto extends ContractDto {
  @Expose()
  @Type(() => RenterDto)
  public renter: RenterDto
}
