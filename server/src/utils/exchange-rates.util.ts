import { formatDate } from './format-date'
import { ServiceUnavailableException } from '@nestjs/common'
import { CurrencyCode } from 'src/house-prices/entities/house-price.entity'

type NBUExchangeRateItem = {
  r030: number
  txt: string
  rate: number
  cc: string
  exchangedate: string
}

export const getExchangeRates = async (date: Date): Promise<Record<CurrencyCode, number>> => {
  try {
    const API_URL = process.env.NBU_API

    const initialRates = new Map<CurrencyCode, number>([
      [CurrencyCode.UAH, 1],
      [CurrencyCode.USD, 0],
      [CurrencyCode.EUR, 0],
      [CurrencyCode.PLN, 0],
    ])

    const formattedDate = formatDate(date)
    const apiResponse = await fetch(`${API_URL}/NBUStatService/v1/statdirectory/exchange?date=${formattedDate}&json`)

    if (!apiResponse.ok) {
      throw new ServiceUnavailableException('NBU API unavailable')
    }

    const rawExchangeRates = (await apiResponse.json()) as NBUExchangeRateItem[]

    rawExchangeRates.forEach(
      ({ cc, rate }) => initialRates.has(cc as CurrencyCode) && initialRates.set(cc as CurrencyCode, rate)
    )

    return Object.fromEntries(initialRates) as Record<CurrencyCode, number>
  } catch (error) {
    if (error instanceof ServiceUnavailableException) {
      throw error
    }
    throw new ServiceUnavailableException('NBU service error')
  }
}
