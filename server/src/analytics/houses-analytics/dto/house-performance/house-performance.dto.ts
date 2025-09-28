import { Expose } from 'class-transformer'

export class HousePerformanceDto {
  @Expose()
  public apartmentName: string

  @Expose()
  public rentersCount: number

  @Expose()
  public totalRevenue: number

  @Expose()
  public currentPayment: number
}
