import { CurrencyCode } from 'src/exchange-rates/entities/exchange-rate.entity'

export const HOUSE_QUERY_DEFAULTS = {
  MIN_PRICE: 1,
  MAX_PRICE: 1000000,
  CURRENCY: CurrencyCode.UAH,
} as const
