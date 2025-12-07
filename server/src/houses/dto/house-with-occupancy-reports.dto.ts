import { Expose } from 'class-transformer'
import { HouseWithPricesDto } from './house-with-prices.dto'
import { RenterDto } from 'src/renters/dto/renter.dto'

export class HouseWithOccupancyReports {
  @Expose()
  houseDetail: HouseWithPricesDto

  @Expose()
  occupancyReports: RenterDto[]
}
