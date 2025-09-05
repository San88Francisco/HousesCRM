import { Expose, Type } from 'class-transformer'
import { HouseDto } from './house.dto'
import { HousePriceDto } from 'src/house-prices/dto/house-price.dto'

export class HouseWithPricesDto extends HouseDto {
  @Expose()
  @Type(() => HousePriceDto)
  public prices: HousePriceDto[]
}
