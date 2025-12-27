import { Contract } from 'src/contracts/entities/contract.entity'
import { CurrencyCode } from 'src/exchange-rates/entities/exchange-rate.entity'
import { ExchangeRatesService } from 'src/exchange-rates/exchange-rates.service'

export async function calculateAverageRatesFromContracts(
  contracts: Contract[],
  exchangeRatesService: ExchangeRatesService
): Promise<Record<CurrencyCode, number>> {
  if (contracts.length === 0) {
    return exchangeRatesService.getExchangeRatesForDate(new Date())
  }

  const contractRates = await Promise.all(
    contracts.map((contract) => exchangeRatesService.getExchangeRatesForDate(contract.commencement))
  )

  const averageRates: Record<CurrencyCode, number> = {} as Record<CurrencyCode, number>

  Object.values(CurrencyCode).forEach((code) => {
    const rates = contractRates.map((r) => r[code])
    const average = rates.reduce((sum, rate) => sum + rate, 0) / rates.length
    averageRates[code] = Number(average.toFixed(4))
  })

  return averageRates
}
