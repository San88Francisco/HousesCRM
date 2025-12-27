import { Expose } from 'class-transformer'
import { CurrencyCode } from 'src/exchange-rates/entities/exchange-rate.entity'

/**
 * DTO для відображення ціни квартири в одній валюті
 * Розраховується на льоту при поверненні даних
 */
export class HousePriceCalculatedDto {
  @Expose()
  code: CurrencyCode

  @Expose()
  amount: number

  @Expose()
  exchangeRate: number
}
