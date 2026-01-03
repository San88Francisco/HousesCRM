import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { getExchangeRates } from 'src/utils/exchange-rates.util'
import { Repository } from 'typeorm'
import { CurrencyCode, ExchangeRate } from './entities/exchange-rate.entity'

@Injectable()
export class ExchangeRatesService {
  private readonly SEARCH_RANGE_DAYS = 45
  private readonly MS_PER_DAY = 24 * 60 * 60 * 1000

  constructor(
    @InjectRepository(ExchangeRate)
    private exchangeRateRepository: Repository<ExchangeRate>
  ) {}

  async getExchangeRatesForDate(date: Date): Promise<Record<CurrencyCode, number>> {
    const cachedRates = await this.findClosestRates(date)

    if (cachedRates) {
      return { ...cachedRates, [CurrencyCode.UAH]: 1 }
    }

    const nbuRates = await getExchangeRates(date)

    await this.saveExchangeRates(date, nbuRates)

    return nbuRates
  }

  private async findClosestRates(targetDate: Date): Promise<Record<CurrencyCode, number> | null> {
    const target = targetDate.toISOString().slice(0, 10)
    const expected = Object.values(CurrencyCode).length - 1

    const rangeMs = this.SEARCH_RANGE_DAYS * this.MS_PER_DAY
    const targetTime = targetDate.getTime()

    const closestDate = await this.exchangeRateRepository
      .createQueryBuilder('r')
      .select('r.date', 'date')
      .where('r.date BETWEEN :start AND :end', {
        start: new Date(targetTime - rangeMs),
        end: new Date(targetTime + rangeMs),
      })
      .groupBy('r.date')
      .having('COUNT(*) = :count', { count: expected })
      .orderBy('ABS(r.date - :target)', 'ASC')
      .setParameter('target', target)
      .limit(1)
      .getRawOne<{ date: string }>()

    if (!closestDate?.date) {
      return null
    }

    const rates = await this.exchangeRateRepository.find({
      where: { date: new Date(closestDate.date) },
    })

    if (rates.length !== expected) {
      return null
    }

    return Object.fromEntries(rates.map((r) => [r.code, Number(r.rate)])) as Record<CurrencyCode, number>
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
