import { Expose } from 'class-transformer'
import { HouseWithPricesDto } from './house-with-prices.dto'
import { HouseDetailAnalyticResponseDto } from 'src/analytics/house-detail-analytics/dto/house-detail-analytic-response.dto'

export class HouseWithOccupancyReports {
  @Expose()
  public houseDetail: HouseWithPricesDto

  @Expose()
  public occupancyReports: HouseDetailAnalyticResponseDto
}
