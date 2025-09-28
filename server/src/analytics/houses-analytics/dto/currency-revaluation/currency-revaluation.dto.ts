import { PickType } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import { HouseDto } from 'src/houses/dto/house.dto'

export class CurrencyRevaluationDto extends PickType(HouseDto, ['id', 'apartmentName'] as const) {
  @Expose()
  @Transform(({ value }) => parseFloat(Number(value).toFixed(2)))
  public purchaseRate: number

  @Expose()
  @Transform(({ value }) => parseFloat(Number(value).toFixed(2)))
  public currentRate: number

  @Expose()
  @Transform(({ value }) => Math.round(Number(value)))
  public revaluationAmountUah: number

  @Expose()
  @Transform(({ value }) => parseFloat(Number(value).toFixed(2)))
  public purchaseAmountUah: number
}
