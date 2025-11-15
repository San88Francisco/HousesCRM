import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { HousesAnalyticsService } from 'src/analytics/houses-analytics/houses-analytics.service'
import { AllHousesAnalyticsDto } from 'src/analytics/houses-analytics/dto/all-houses-analytics.dto'
import { HouseOverviewDto } from 'src/analytics/houses-analytics/dto/houses-overview/houses-overview.dto'
import { RevenueDistributionDto } from 'src/analytics/houses-analytics/dto/revenue-distribution/revenue-distribution.dto'
import { HousePaybackStatsDto } from 'src/analytics/houses-analytics/dto/house-payback-stats/house-payback-stats.dto'
import { CurrencyRevaluationDto } from 'src/analytics/houses-analytics/dto/currency-revaluation/currency-revaluation.dto'
import { HousePerformanceResponseDto } from 'src/analytics/houses-analytics/dto/house-performance/house-performance-response.dto'
import { HousesOverviewQueryDto } from 'src/analytics/houses-analytics/dto/houses-overview/houses-overview-query.dto'
import { QueryDto } from 'src/common/dto/query.dto'
import { Auth } from 'src/common/decorators/auth.decorator'
import { HOUSES_ANALYTICS_ROUTES } from './constants/houses-analytics.routes'

@ApiTags('Houses Analytics')
@Controller(HOUSES_ANALYTICS_ROUTES.ROOT)
export class HousesAnalyticsController {
  constructor(private readonly housesAnalyticsService: HousesAnalyticsService) {}

  @Get(HOUSES_ANALYTICS_ROUTES.ANALYTICS)
  @Auth()
  async getHousesAnalytics(): Promise<AllHousesAnalyticsDto> {
    return this.housesAnalyticsService.getAllHousesAnalytics()
  }

  @Get(HOUSES_ANALYTICS_ROUTES.HOUSES_OVERVIEW_ANALYTIC)
  @Auth()
  async getHousesOverview(@Query() query: HousesOverviewQueryDto): Promise<HouseOverviewDto[]> {
    return this.housesAnalyticsService.getHousesOverview(query)
  }

  @Get(HOUSES_ANALYTICS_ROUTES.REVENUE_DISTRIBUTION_ANALYTIC)
  @Auth()
  async getRevenueDistribution(): Promise<RevenueDistributionDto> {
    return this.housesAnalyticsService.getRevenueDistribution()
  }

  @Get(HOUSES_ANALYTICS_ROUTES.HOUSE_PAYBACK_STATS_ANALYTIC)
  @Auth()
  async getHousePaybackStats(): Promise<HousePaybackStatsDto[]> {
    return this.housesAnalyticsService.getHousePaybackStats()
  }

  @Get(HOUSES_ANALYTICS_ROUTES.CURRENCY_REVALUATION_ANALYTIC)
  @Auth()
  async getCurrencyRevaluation(): Promise<CurrencyRevaluationDto[]> {
    return this.housesAnalyticsService.getCurrencyRevaluation()
  }

  @Get(HOUSES_ANALYTICS_ROUTES.HOUSES_PERFORMANCE_ANALYTIC)
  @Auth()
  async getHousesPerformance(@Query() query: QueryDto): Promise<HousePerformanceResponseDto> {
    return this.housesAnalyticsService.getHousesPerformance(query)
  }
}
