import { Injectable } from '@nestjs/common'
import { House } from 'src/houses/entities/house.entity'
import { CurrencyCode, HousePrice } from './entities/house-price.entity'
import { getExchangeRates } from 'src/utils/exchange-rates.util'

@Injectable()
export class HousePricesConverterService {
  async convert(price: number, house: House): Promise<HousePrice[]> {
    const rates = await getExchangeRates(house.purchaseDate)

    return Object.entries(rates).map(([code, rate]) =>
      this.createPrice(price / rate, code as CurrencyCode, house, rate)
    )
  }

  private createPrice(amount: number, currency: CurrencyCode, house: House, exchangeRate: number): HousePrice {
    const price = new HousePrice()
    price.amount = +amount.toFixed(2)
    price.code = currency
    price.house = house
    price.exchangeRate = +exchangeRate.toFixed(2)
    return price
  }
}
