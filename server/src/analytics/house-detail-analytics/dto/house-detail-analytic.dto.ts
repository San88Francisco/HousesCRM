import { Expose } from 'class-transformer'
import { RenterDto } from 'src/renters/dto/renter.dto'

export class HouseDetailAnalyticDto extends RenterDto {
  @Expose()
  public totalIncome: number
}
