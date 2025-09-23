import { CurrencyCode } from 'src/house-prices/entities/house-price.entity'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getExchangeRates(date: Date): Record<CurrencyCode, number> {
  // TODO: Implement API call to fetch exchange rates
  return {
    [CurrencyCode.UAH]: 1,
    [CurrencyCode.USD]: 40,
    [CurrencyCode.EUR]: 42,
    [CurrencyCode.PLN]: 9,
  }
}
