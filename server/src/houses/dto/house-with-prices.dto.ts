import { Expose, Type } from 'class-transformer'
import { HouseDto } from './house.dto'
import { HousePriceCalculatedDto } from './house-price-calculated.dto'

/**
 * DTO для квартири з цінами у всіх валютах
 * Ціни розраховуються на льоту при поверненні даних
 */
export class HouseWithPricesDto extends HouseDto {
  @Expose()
  @Type(() => HousePriceCalculatedDto)
  prices: HousePriceCalculatedDto[]
}
