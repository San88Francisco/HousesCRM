import { Expose, Type } from 'class-transformer'
import { ContractWithRevenueResponseDto } from './contract-with-revenue-response.dto'
import { RenterDto } from 'src/renters/dto/renter.dto'

export class AllRenterAnalyticDto {
  @Expose()
  @Type(() => RenterDto)
  oneRenterReport: RenterDto

  @Expose()
  @Type(() => ContractWithRevenueResponseDto)
  allContractsByRenterId: ContractWithRevenueResponseDto
}
