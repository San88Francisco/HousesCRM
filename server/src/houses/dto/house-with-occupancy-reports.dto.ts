import { Expose, Type } from 'class-transformer'
import { HouseWithPricesDto } from './house-with-prices.dto'
import { HouseOccupancyReportResponseDto } from './house-occupancy-report-response.dto'

export class HouseWithOccupancyReports {
  @Expose()
  houseDetail: HouseWithPricesDto

  @Expose()
  @Type(() => HouseOccupancyReportResponseDto)
  occupancyReports: HouseOccupancyReportResponseDto
}
