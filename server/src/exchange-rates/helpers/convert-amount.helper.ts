import { CurrencyCode } from '../entities/exchange-rate.entity'

/**
 * Helper для конвертації суми у всі валюти
 * Використовується для швидкої конвертації без сервісу
 */
export function convertAmountToAllCurrencies(
  amount: number,
  rates: Record<CurrencyCode, number>
): Array<{ code: CurrencyCode; amount: number; exchangeRate: number }> {
  return Object.entries(rates).map(([code, rate]) => ({
    code: code as CurrencyCode,
    amount: Number((amount / rate).toFixed(2)),
    exchangeRate: Number(rate.toFixed(4)),
  }))
}
