import { CurrencyCode } from 'src/house-prices/enums/currency-code.enum'

export const HOUSE_QUERY_DEFAULTS = {
  MIN_PRICE: 1,
  MAX_PRICE: 1000000,
  CURRENCY: CurrencyCode.UAH,
} as const
