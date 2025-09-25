import { PickType } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { HouseDto } from 'src/houses/dto/house.dto'

export class RevenueDistributionItemDto extends PickType(HouseDto, ['id', 'apartmentName'] as const) {
  @Expose()
  @Type(() => Number)
  public apartmentTotalRevenue: number

  @Expose()
  @Type(() => Number)
  public percentage: number
}

export class RevenueDistributionDto {
  @Expose()
  @Type(() => RevenueDistributionItemDto)
  public data: RevenueDistributionItemDto[]

  @Expose()
  @Type(() => Number)
  public grandTotal: number
}
