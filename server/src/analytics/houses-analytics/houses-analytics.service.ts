import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { QUERY_DEFAULTS } from 'src/common/constants/query.constant'
import { QueryDto } from 'src/common/dto/query.dto'
import { SortOrder } from 'src/common/enums/sort-order.enum'
import { CurrencyCode } from 'src/exchange-rates/entities/exchange-rate.entity'
import { ExchangeRatesService } from 'src/exchange-rates/exchange-rates.service'
import { convertAmountToAllCurrencies } from 'src/exchange-rates/helpers/convert-amount.helper'
import { splitContractIntoPeriods } from 'src/exchange-rates/helpers/split-contract-periods.helper'
import { House } from 'src/houses/entities/house.entity'
import { PaginatedResult } from 'types'
import { calculateAverageRatesFromContracts } from '../helpers/average-rates.helper'
import { housesPerformance } from '../helpers/houses-performance.helper'
import { calculatePaybackStatsForHouses } from '../helpers/payback-stats.helpers'
import { calculateHouseRevenue, calculateRevenuePercentages } from '../helpers/revenue.helpers'
import { HouseWithContractArray } from '../types'
import { HousePerformanceBase, RevenueDistributionItemBase } from '../types/analytics.types'
import {
  ComputedFieldKey,
  ComputedSortBy,
  computedSortMapping,
  isComputedSort,
} from './constants/computed-sort-mapping'
import { AllHousesAnalyticsDto } from './dto/all-houses-analytics.dto'
import { CurrencyRevaluationDto } from './dto/currency-revaluation/currency-revaluation.dto'
import { HousePaybackStatsDto } from './dto/house-payback-stats/house-payback-stats.dto'
import { HousePerformanceResponseDto } from './dto/house-performance/house-performance-response.dto'
import { HousePerformanceDto } from './dto/house-performance/house-performance.dto'
import { HousesOverviewQueryDto } from './dto/houses-overview/houses-overview-query.dto'
import { HouseOverviewDto } from './dto/houses-overview/houses-overview.dto'
import { RevenueDistributionDto } from './dto/revenue-distribution/revenue-distribution.dto'

@Injectable()
export class HousesAnalyticsService {
  constructor(
    @InjectRepository(House)
    private readonly houseRepository: Repository<House>,
    private readonly exchangeRatesService: ExchangeRatesService
  ) {}

  async getAllHousesAnalytics(): Promise<AllHousesAnalyticsDto> {
    const [housesOverview, revenueDistribution, housesPaybackStats, currencyRevaluation, housesPerformanceResult] =
      await Promise.all([
        this.getHousesOverview(),
        this.getRevenueDistribution(),
        this.getHousePaybackStats(),
        this.getCurrencyRevaluation(),
        this.getHousesPerformance({ page: 1, limit: 10 }),
      ])

    const transformedData = {
      housesOverview,
      revenueDistribution,
      housesPaybackStats,
      currencyRevaluation,
      housesPerformance: housesPerformanceResult,
    }

    return plainToInstance(AllHousesAnalyticsDto, transformedData, {
      excludeExtraneousValues: true,
    })
  }

  async getHousesOverview(dto?: HousesOverviewQueryDto): Promise<HouseOverviewDto[]> {
    const qb = this.buildHousesOverviewQuery(dto)
    const houses = await qb.getMany()

    const housesWithCurrencies = await Promise.all(
      (houses as HouseWithContractArray[]).map(async (house) => ({
        ...house,
        contract: await Promise.all(
          (house.contract || []).map(async (contract) => {
            const periods = splitContractIntoPeriods(contract.commencement, contract.termination)

            const monthlyPaymentInCurrencies = await Promise.all(
              periods.map(async (period) => {
                const rates = await this.exchangeRatesService.getExchangeRatesForDate(period.from)

                return {
                  period: {
                    from: period.from,
                    to: period.to,
                  },
                  currencies: convertAmountToAllCurrencies(contract.monthlyPayment, rates),
                }
              })
            )

            return {
              ...contract,
              monthlyPaymentInCurrencies,
            }
          })
        ),
      }))
    )

    return plainToInstance(HouseOverviewDto, housesWithCurrencies, {
      excludeExtraneousValues: true,
    })
  }

  private buildHousesOverviewQuery(dto?: HousesOverviewQueryDto): SelectQueryBuilder<House> {
    const dateFrom = dto?.dateFrom
    const dateTo = dto?.dateTo

    const qb = this.houseRepository
      .createQueryBuilder('house')
      .leftJoinAndMapMany('house.contract', 'house.contracts', 'contract')
      .leftJoinAndSelect('contract.renter', 'renter')
      .select([
        'house.id',
        'house.apartmentName',
        'contract.id',
        'contract.commencement',
        'contract.termination',
        'contract.monthlyPayment',
        'contract.paymentCurrency',
        'renter.id',
        'renter.firstName',
        'renter.lastName',
      ])

    if (dateFrom && dateTo) {
      qb.andWhere('contract.commencement <= :dateTo', { dateTo }).andWhere(
        '(contract.termination IS NULL OR contract.termination >= :dateFrom)',
        { dateFrom }
      )
    } else if (dateFrom) {
      qb.andWhere('(contract.termination IS NULL OR contract.termination >= :dateFrom)', { dateFrom })
    } else if (dateTo) {
      qb.andWhere('contract.commencement <= :dateTo', { dateTo })
    }

    return qb
  }

  async getRevenueDistribution(): Promise<RevenueDistributionDto> {
    const houses = await this.houseRepository.find({
      relations: { contracts: true },
    })

    const housesRevenue = houses.map(calculateHouseRevenue)
    const revenueData = calculateRevenuePercentages(housesRevenue)

    const dataWithCurrencies = await Promise.all(
      revenueData.data.map(async (item: RevenueDistributionItemBase & { percentage: number }) => {
        const house = houses.find((h) => h.apartmentName === item.apartmentName)
        if (!house) {
          return item
        }

        const averageRates = await calculateAverageRatesFromContracts(house.contracts, this.exchangeRatesService)

        return {
          ...item,
          apartmentTotalRevenueInCurrencies: convertAmountToAllCurrencies(item.apartmentTotalRevenue, averageRates),
        }
      })
    )

    const allContracts = houses.flatMap((h) => h.contracts)
    const grandAverageRates = await calculateAverageRatesFromContracts(allContracts, this.exchangeRatesService)

    const resultData = {
      data: dataWithCurrencies,
      grandTotal: revenueData.grandTotal,
      grandTotalInCurrencies: convertAmountToAllCurrencies(revenueData.grandTotal, grandAverageRates),
    }

    return plainToInstance(RevenueDistributionDto, resultData, {
      excludeExtraneousValues: true,
    })
  }

  async getHousePaybackStats(): Promise<HousePaybackStatsDto[]> {
    const houses = await this.houseRepository.find({
      relations: { contracts: true },
    })

    const paybackStats = calculatePaybackStatsForHouses(houses)

    const statsWithCurrencies = await Promise.all(
      paybackStats.map(async (stat) => {
        const house = houses.find((h) => h.id === stat.id)
        if (!house) {
          return stat
        }

        const purchaseRates = await this.exchangeRatesService.getExchangeRatesForDate(house.purchaseDate)

        const averageRates = await calculateAverageRatesFromContracts(house.contracts, this.exchangeRatesService)

        return {
          ...stat,
          purchasePriceInCurrencies: convertAmountToAllCurrencies(stat.purchasePrice, purchaseRates),
          totalIncomeInCurrencies: convertAmountToAllCurrencies(stat.totalIncome, averageRates),
        }
      })
    )

    return plainToInstance(HousePaybackStatsDto, statsWithCurrencies, {
      excludeExtraneousValues: true,
    })
  }

  async getCurrencyRevaluation(): Promise<CurrencyRevaluationDto[]> {
    const [houses, currentRates] = await Promise.all([
      this.houseRepository.find(),
      this.exchangeRatesService.getExchangeRatesForDate(new Date()),
    ])

    const { USD } = currentRates

    const currencyRevaluation = await Promise.all(
      houses.map(async ({ apartmentName, id, price, purchaseDate }) => {
        const purchaseRates = await this.exchangeRatesService.getExchangeRatesForDate(purchaseDate)

        const usdPurchaseRate = purchaseRates[CurrencyCode.USD]

        const purchaseAmount = price

        const priceInUSD = Number((price / usdPurchaseRate).toFixed(2))
        const revaluationAmount = Number((priceInUSD * USD).toFixed(2))

        return {
          id,
          apartmentName,
          purchaseRate: Number(usdPurchaseRate.toFixed(4)),
          currentRate: Number(USD.toFixed(4)),
          revaluationAmount,
          revaluationAmountInCurrencies: convertAmountToAllCurrencies(revaluationAmount, currentRates),
          purchaseAmount,
          purchaseAmountInCurrencies: convertAmountToAllCurrencies(purchaseAmount, purchaseRates),
        }
      })
    )

    return plainToInstance(CurrencyRevaluationDto, currencyRevaluation, {
      excludeExtraneousValues: true,
    })
  }

  async getHousesPerformance(dto: QueryDto): Promise<HousePerformanceResponseDto> {
    const {
      page = QUERY_DEFAULTS.PAGE,
      limit = QUERY_DEFAULTS.LIMIT,
      order = QUERY_DEFAULTS.ORDER,
      sortBy = QUERY_DEFAULTS.SORT_BY,
    } = dto

    let result: PaginatedResult<HousePerformanceDto>

    if (isComputedSort(sortBy)) {
      result = await this.getComputedPerformance({ page, limit, order, sortBy })
    } else {
      result = await this.getDbSortedPerformance({ page, limit, order, sortBy })
    }

    const rawData = {
      data: result.data,
      meta: {
        total: result.total,
        page,
        limit,
      },
    }

    return plainToInstance(HousePerformanceResponseDto, rawData, {
      excludeExtraneousValues: true,
    })
  }

  private async getComputedPerformance(params: {
    page: number
    limit: number
    order: SortOrder
    sortBy: ComputedSortBy
  }): Promise<PaginatedResult<HousePerformanceDto>> {
    const { page, limit, order, sortBy } = params

    const houses = await this.houseRepository.find({
      relations: { contracts: { renter: true } },
    })

    const computed = housesPerformance(houses)

    const computedWithCurrencies = await Promise.all(
      computed.map(async (item: HousePerformanceBase) => {
        const house = houses.find((h) => h.apartmentName === item.apartmentName)
        if (!house) {
          return item
        }

        const averageRates = await calculateAverageRatesFromContracts(house.contracts, this.exchangeRatesService)

        const currentRates = await this.exchangeRatesService.getExchangeRatesForDate(new Date())

        return {
          ...item,
          totalRevenueInCurrencies: convertAmountToAllCurrencies(item.totalRevenue, averageRates),
          currentPaymentInCurrencies: convertAmountToAllCurrencies(item.currentPayment, currentRates),
        }
      })
    )

    const dir = order === SortOrder.ASC ? 1 : -1
    const sortField = computedSortMapping[sortBy]

    computedWithCurrencies.sort(
      (
        a: HousePerformanceBase & { totalRevenueInCurrencies?: unknown; currentPaymentInCurrencies?: unknown },
        b: HousePerformanceBase & { totalRevenueInCurrencies?: unknown; currentPaymentInCurrencies?: unknown }
      ) => {
        const va = (a as unknown as Record<ComputedFieldKey, number | null>)[sortField]
        const vb = (b as unknown as Record<ComputedFieldKey, number | null>)[sortField]

        if (va === null && vb === null) {
          return 0
        }
        if (va === null) {
          return 1
        }
        if (vb === null) {
          return -1
        }

        return (va - vb) * dir
      }
    )

    const total = computedWithCurrencies.length
    const start = (page - 1) * limit
    const data = computedWithCurrencies.slice(start, start + limit) as HousePerformanceDto[]

    return { data, total }
  }

  private async getDbSortedPerformance(params: {
    page: number
    limit: number
    order: SortOrder
    sortBy: string
  }): Promise<PaginatedResult<HousePerformanceDto>> {
    const { page, limit, order, sortBy } = params

    const qb = this.houseRepository
      .createQueryBuilder('house')
      .leftJoinAndSelect('house.contracts', 'contract')
      .leftJoinAndSelect('contract.renter', 'renter')
      .orderBy(`house.${sortBy}`, order)
      .skip((page - 1) * limit)
      .take(limit)

    const [houses, count] = await qb.getManyAndCount()
    const computed = housesPerformance(houses)

    const data = (await Promise.all(
      computed.map(async (item: HousePerformanceBase) => {
        const house = houses.find((h) => h.apartmentName === item.apartmentName)
        if (!house) {
          return item
        }

        const averageRates = await calculateAverageRatesFromContracts(house.contracts, this.exchangeRatesService)

        const currentRates = await this.exchangeRatesService.getExchangeRatesForDate(new Date())

        return {
          ...item,
          totalRevenueInCurrencies: convertAmountToAllCurrencies(item.totalRevenue, averageRates),
          currentPaymentInCurrencies: convertAmountToAllCurrencies(item.currentPayment, currentRates),
        }
      })
    )) as HousePerformanceDto[]

    return { data, total: count }
  }
}
