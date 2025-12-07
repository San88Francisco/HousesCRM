import { Expose, Type } from 'class-transformer'
import { RenterDetailAnalyticDto } from './renter-detail-analytic.dto'
import { ContractWithRevenueResponseDto } from './contract-with-revenue-response.dto'

export class AllRenterAnalyticDto {
  @Expose()
  @Type(() => RenterDetailAnalyticDto)
  oneRenterReport: RenterDetailAnalyticDto

  @Expose()
  @Type(() => ContractWithRevenueResponseDto)
  allContractsByRenterId: ContractWithRevenueResponseDto
}
