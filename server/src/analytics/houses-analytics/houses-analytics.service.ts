import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { ContractStatus } from 'src/contracts/enums/contract-status.enum'
import { House } from 'src/houses/entities/house.entity'
import { Repository } from 'typeorm'
import { HouseOverviewDto } from './dto/houses-overview/houses-overview.dto'
import { RevenueDistributionDto } from './dto/revenue-distribution/revenue-distribution.dto'
import { AllHousesAnalyticsDto } from './dto/all-houses-analytics.dto'
import { calculateHouseRevenue, calculateRevenuePercentages } from './helpers/revenue.helpers'
import { calculatePaybackStatsForHouses } from './helpers/payback-stats.helpers'
import { HousePaybackStatsDto } from './dto/house-payback-stats/house-payback-stats.dto'
import { getExchangeRates } from 'src/utils/exchange-rates.util'
import { CurrencyCode } from 'src/house-prices/enums/currency-code.enum'
import { CurrencyRevaluationDto } from './dto/currency-revaluation/currency-revaluation.dto'
import { QueryDto } from 'src/common/dto/query.dto'
import { QUERY_DEFAULTS } from 'src/common/constants/query.constant'
import { HousePerformanceResponseDto } from './dto/house-performance/house-performance-response.dto'
import { housesPerformance } from './helpers/houses-performance.helper'

@Injectable()
export class HousesAnalyticsService {
  constructor(
    @InjectRepository(House)
    private houseRepository: Repository<House>
  ) {}

  public async getAllHousesAnalytics(): Promise<AllHousesAnalyticsDto> {
    const [housesOverview, revenueDistribution, housesPaybackStats, currencyRevaluation, housesPerformance] =
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
      housesPerformance,
    }

    return plainToInstance(AllHousesAnalyticsDto, transformedData, {
      excludeExtraneousValues: true,
    })
  }

  public async getHousesOverview(): Promise<HouseOverviewDto[]> {
    const houses = await this.houseRepository
      .createQueryBuilder('house')
      .leftJoinAndMapOne('house.contract', 'house.contracts', 'contract', 'contract.status = :status', {
        status: ContractStatus.ACTIVE,
      })
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
      .getMany()

    return plainToInstance(HouseOverviewDto, houses, {
      excludeExtraneousValues: true,
    })
  }

  public async getRevenueDistribution(): Promise<RevenueDistributionDto> {
    const houses = await this.houseRepository.find({ relations: { contracts: true } })

    const housesRevenue = houses.map(calculateHouseRevenue)

    const revenueData = calculateRevenuePercentages(housesRevenue)

    return plainToInstance(RevenueDistributionDto, revenueData, {
      excludeExtraneousValues: true,
    })
  }

  public async getHousePaybackStats(): Promise<HousePaybackStatsDto[]> {
    const houses = await this.houseRepository.find({ relations: { contracts: true, prices: true } })

    const paybackStats = calculatePaybackStatsForHouses(houses)

    return plainToInstance(HousePaybackStatsDto, paybackStats, {
      excludeExtraneousValues: true,
    })
  }

  public async getCurrencyRevaluation(): Promise<CurrencyRevaluationDto[]> {
    const [houses, exchangeRates] = await Promise.all([
      this.houseRepository.find({
        relations: { prices: true },
      }),
      getExchangeRates(new Date()),
    ])

    const { USD } = exchangeRates

    const currencyRevaluation = houses.map(({ apartmentName, id, prices }): CurrencyRevaluationDto | null => {
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

    return plainToInstance(CurrencyRevaluationDto, currencyRevaluation, {
      excludeExtraneousValues: true,
    })
  }

  public async getHousesPerformance(dto: QueryDto): Promise<HousePerformanceResponseDto> {
    const {
      page = QUERY_DEFAULTS.PAGE,
      limit = QUERY_DEFAULTS.LIMIT,
      order = QUERY_DEFAULTS.ORDER,
      sortBy = QUERY_DEFAULTS.SORT_BY,
    } = dto

    const [houses, total] = await this.houseRepository.findAndCount({
      relations: { contracts: { renter: true } },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        [sortBy]: order,
      },
    })

    const rawData = {
      data: housesPerformance(houses),
      meta: {
        total,
        page,
        limit,
      },
    }

    return plainToInstance(HousePerformanceResponseDto, rawData, {
      excludeExtraneousValues: true,
    })
  }
}
