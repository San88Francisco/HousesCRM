import { Expose } from 'class-transformer'
import { RenterDto } from 'src/renters/dto/renter.dto'

export class RenterDetailAnalyticDto extends RenterDto {
  @Expose()
  totalIncome: number
}
