import { PickType } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { HouseDto } from 'src/houses/dto/house.dto'

export class HousePaybackStatsDto extends PickType(HouseDto, ['id', 'apartmentName', 'purchaseDate'] as const) {
  @Expose()
  purchasePriceUSD: number

  @Expose()
  totalIncomeUSD: number

  @Expose()
  paybackCoefficient: number
}
