import { Expose } from 'class-transformer'

export class HousePerformanceDto {
  @Expose()
  apartmentName: string

  @Expose()
  rentersCount: number

  @Expose()
  totalRevenue: number

  @Expose()
  currentPayment: number
}
