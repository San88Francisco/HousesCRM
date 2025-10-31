import { Expose } from 'class-transformer'
import { HouseWithPricesDto } from './house-with-prices.dto'
import { HouseDetailAnalyticDto } from 'src/analytics/house-detail-analytics/dto/house-detail-analytic.dto'

export class HouseWithOccupancyReports {
  @Expose()
  public houseDetail: HouseWithPricesDto

  @Expose()
  public occupancyReports: HouseDetailAnalyticDto[]
}
