import { Injectable } from '@nestjs/common'
import { House } from 'src/houses/entities/house.entity'
import { HousePrice } from './entities/house-price.entity'
import { CurrencyCode } from './enums/currency-code.enum'
import { getExchangeRates } from 'src/utils/exchange-rates.util'

@Injectable()
export class HousePricesConverterService {
  public convert(price: number, house: House): HousePrice[] {
    const rates = getExchangeRates(house.purchaseDate)

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
