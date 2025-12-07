import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { House } from 'src/houses/entities/house.entity'
import { HouseOverviewDto } from './dto/houses-overview/houses-overview.dto'
import { RevenueDistributionDto } from './dto/revenue-distribution/revenue-distribution.dto'
import { AllHousesAnalyticsDto } from './dto/all-houses-analytics.dto'
import { calculateHouseRevenue, calculateRevenuePercentages } from '../helpers/revenue.helpers'
import { calculatePaybackStatsForHouses } from '../helpers/payback-stats.helpers'
import { HousePaybackStatsDto } from './dto/house-payback-stats/house-payback-stats.dto'
import { getExchangeRates } from 'src/utils/exchange-rates.util'
import { CurrencyRevaluationDto } from './dto/currency-revaluation/currency-revaluation.dto'
import { QueryDto } from 'src/common/dto/query.dto'
import { QUERY_DEFAULTS } from 'src/common/constants/query.constant'
import { HousePerformanceResponseDto } from './dto/house-performance/house-performance-response.dto'
import { housesPerformance } from '../helpers/houses-performance.helper'
import { CurrencyCode } from 'src/house-prices/entities/house-price.entity'
import { HousesOverviewQueryDto } from './dto/houses-overview/houses-overview-query.dto'
import { SortOrder } from 'src/common/enums/sort-order.enum'
import { HousePerformanceDto } from './dto/house-performance/house-performance.dto'
import { ComputedSortBy, computedSortMapping, isComputedSort } from './constants/computed-sort-mapping'
import { PaginatedResult } from 'types'

@Injectable()
export class HousesAnalyticsService {
  constructor(
    @InjectRepository(House)
    private readonly houseRepository: Repository<House>
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

    return plainToInstance(HouseOverviewDto, houses, {
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

    return plainToInstance(RevenueDistributionDto, revenueData, {
      excludeExtraneousValues: true,
    })
  }

  async getHousePaybackStats(): Promise<HousePaybackStatsDto[]> {
    const houses = await this.houseRepository.find({
      relations: { contracts: true, prices: true },
    })

    const paybackStats = calculatePaybackStatsForHouses(houses)

    return plainToInstance(HousePaybackStatsDto, paybackStats, {
      excludeExtraneousValues: true,
    })
  }

  async getCurrencyRevaluation(): Promise<CurrencyRevaluationDto[]> {
    const [houses, exchangeRates] = await Promise.all([
      this.houseRepository.find({
        relations: { prices: true },
      }),
      getExchangeRates(new Date()),
    ])

    const { USD } = exchangeRates

    const currencyRevaluation = houses
      .map(({ apartmentName, id, prices }): CurrencyRevaluationDto | null => {
        const usdPrice = prices.find((price) => price.code === CurrencyCode.USD)
        const uahPrice = prices.find((price) => price.code === CurrencyCode.UAH)

        if (!usdPrice || !uahPrice) {
          return null
        }

        return {
          id,
          apartmentName,
          purchaseRate: usdPrice.exchangeRate,
          currentRate: USD,
          revaluationAmountUah: usdPrice.amount * USD,
          purchaseAmountUah: uahPrice.amount,
        }
      })
      .filter((item): item is CurrencyRevaluationDto => item !== null)

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

    const dir = order === SortOrder.ASC ? 1 : -1
    const sortField = computedSortMapping[sortBy]

    computed.sort((a, b) => {
      const va = a[sortField] as number | null
      const vb = b[sortField] as number | null

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
    })

    const total = computed.length
    const start = (page - 1) * limit
    const data = computed.slice(start, start + limit)

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
    const data = housesPerformance(houses)

    return { data, total: count }
  }
}
