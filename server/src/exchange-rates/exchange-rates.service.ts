import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { getExchangeRates } from 'src/utils/exchange-rates.util'
import { Between, Repository } from 'typeorm'
import { CurrencyCode, ExchangeRate } from './entities/exchange-rate.entity'

@Injectable()
export class ExchangeRatesService {
  constructor(
    @InjectRepository(ExchangeRate)
    private exchangeRateRepository: Repository<ExchangeRate>
  ) {}

  async getExchangeRatesForDate(date: Date): Promise<Record<CurrencyCode, number>> {
    const rangeInDays = 45
    const startDate = new Date(date)
    startDate.setDate(startDate.getDate() - rangeInDays)

    const endDate = new Date(date)
    endDate.setDate(endDate.getDate() + rangeInDays)

    const cachedRates = await this.findClosestRates(date, startDate, endDate)

    const expectedCount = Object.keys(CurrencyCode).length - 1
    if (cachedRates && Object.keys(cachedRates).length === expectedCount) {
      return { ...cachedRates, [CurrencyCode.UAH]: 1 }
    }

    const nbuRates = await getExchangeRates(date)

    await this.saveExchangeRates(date, nbuRates)

    return nbuRates
  }

  private async findClosestRates(
    targetDate: Date,
    startDate: Date,
    endDate: Date
  ): Promise<Record<CurrencyCode, number> | null> {
    const rates = await this.exchangeRateRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
      order: {
        date: 'DESC',
      },
    })

    if (rates.length === 0) {
      return null
    }

    const ratesByDate = rates.reduce(
      (acc, rate) => {
        const dateObj = rate.date instanceof Date ? rate.date : new Date(rate.date)
        const dateKey = dateObj.toISOString().split('T')[0]
        if (!acc[dateKey]) {
          acc[dateKey] = []
        }
        acc[dateKey].push(rate)
        return acc
      },
      {} as Record<string, ExchangeRate[]>
    )

    const targetTime = targetDate.getTime()
    let closestDate: string | null = null
    let closestDiff = Infinity

    for (const dateKey of Object.keys(ratesByDate)) {
      const rateDate = new Date(dateKey)
      const diff = Math.abs(rateDate.getTime() - targetTime)

      if (diff < closestDiff) {
        closestDiff = diff
        closestDate = dateKey
      }
    }

    if (!closestDate) {
      return null
    }

    const closestRates = ratesByDate[closestDate]
    if (closestRates.length !== Object.keys(CurrencyCode).length) {
      return null
    }

    return closestRates.reduce(
      (acc, rate) => {
        acc[rate.code] = Number(rate.rate)
        return acc
      },
      {} as Record<CurrencyCode, number>
    )
  }

  private async saveExchangeRates(date: Date, rates: Record<CurrencyCode, number>): Promise<void> {
    const normalizedDate = new Date(date.toISOString().split('T')[0])

    const entities = Object.entries(rates)
      .filter(([code]) => (code as CurrencyCode) !== CurrencyCode.UAH)
      .map(([code, rate]) => ({
        date: normalizedDate,
        code: code as CurrencyCode,
        rate: Number(rate.toFixed(4)),
      }))

    await this.exchangeRateRepository
      .createQueryBuilder()
      .insert()
      .into(ExchangeRate)
      .values(entities)
      .orUpdate(['rate', 'updated_at'], ['date', 'code'])
      .execute()
  }

  async convertAmount(amount: number, fromCurrency: CurrencyCode, date: Date): Promise<Record<CurrencyCode, number>> {
    const rates = await this.getExchangeRatesForDate(date)

    const amountInUAH = amount * rates[fromCurrency]

    const result: Record<CurrencyCode, number> = {} as Record<CurrencyCode, number>

    for (const [code, rate] of Object.entries(rates)) {
      result[code as CurrencyCode] = Number((amountInUAH / rate).toFixed(2))
    }

    return result
  }

  async deleteOldRates(beforeDate: Date): Promise<void> {
    await this.exchangeRateRepository
      .createQueryBuilder()
      .delete()
      .where('date < :date', { date: beforeDate })
      .execute()
  }
}
