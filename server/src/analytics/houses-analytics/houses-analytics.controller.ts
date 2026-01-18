import { Controller, Get, Query, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { AllHousesAnalyticsDto } from 'src/analytics/houses-analytics/dto/all-houses-analytics.dto'
import { CurrencyRevaluationDto } from 'src/analytics/houses-analytics/dto/currency-revaluation/currency-revaluation.dto'
import { HousePaybackStatsDto } from 'src/analytics/houses-analytics/dto/house-payback-stats/house-payback-stats.dto'
import { HousePerformanceResponseDto } from 'src/analytics/houses-analytics/dto/house-performance/house-performance-response.dto'
import { HousesOverviewQueryDto } from 'src/analytics/houses-analytics/dto/houses-overview/houses-overview-query.dto'
import { HouseOverviewDto } from 'src/analytics/houses-analytics/dto/houses-overview/houses-overview.dto'
import { RevenueDistributionDto } from 'src/analytics/houses-analytics/dto/revenue-distribution/revenue-distribution.dto'
import { HousesAnalyticsService } from 'src/analytics/houses-analytics/houses-analytics.service'
import type { AuthenticatedRequest } from 'src/auth/types'
import { Auth } from 'src/common/decorators/auth.decorator'
import { QueryDto } from 'src/common/dto/query.dto'
import type { JwtPayload } from 'types/jwt/jwt.types'
import { HOUSES_ANALYTICS_ROUTES } from './constants/houses-analytics.routes'

@ApiTags('Houses Analytics')
@Controller(HOUSES_ANALYTICS_ROUTES.ROOT)
export class HousesAnalyticsController {
  constructor(private readonly housesAnalyticsService: HousesAnalyticsService) {}

  @Get(HOUSES_ANALYTICS_ROUTES.ANALYTICS)
  @Auth()
  async getHousesAnalytics(@Req() req: AuthenticatedRequest<JwtPayload>): Promise<AllHousesAnalyticsDto> {
    return this.housesAnalyticsService.getAllHousesAnalytics(req.user.sub)
  }

  @Get(HOUSES_ANALYTICS_ROUTES.HOUSES_OVERVIEW_ANALYTIC)
  @Auth()
  async getHousesOverview(
    @Query() query: HousesOverviewQueryDto,
    @Req() req: AuthenticatedRequest<JwtPayload>
  ): Promise<HouseOverviewDto[]> {
    return this.housesAnalyticsService.getHousesOverview(query, req.user.sub)
  }

  @Get(HOUSES_ANALYTICS_ROUTES.REVENUE_DISTRIBUTION_ANALYTIC)
  @Auth()
  async getRevenueDistribution(@Req() req: AuthenticatedRequest<JwtPayload>): Promise<RevenueDistributionDto> {
    return this.housesAnalyticsService.getRevenueDistribution(req.user.sub)
  }

  @Get(HOUSES_ANALYTICS_ROUTES.HOUSE_PAYBACK_STATS_ANALYTIC)
  @Auth()
  async getHousePaybackStats(@Req() req: AuthenticatedRequest<JwtPayload>): Promise<HousePaybackStatsDto[]> {
    return this.housesAnalyticsService.getHousePaybackStats(req.user.sub)
  }

  @Get(HOUSES_ANALYTICS_ROUTES.CURRENCY_REVALUATION_ANALYTIC)
  @Auth()
  async getCurrencyRevaluation(@Req() req: AuthenticatedRequest<JwtPayload>): Promise<CurrencyRevaluationDto[]> {
    return this.housesAnalyticsService.getCurrencyRevaluation(req.user.sub)
  }

  @Get(HOUSES_ANALYTICS_ROUTES.HOUSES_PERFORMANCE_ANALYTIC)
  @Auth()
  async getHousesPerformance(
    @Query() query: QueryDto,
    @Req() req: AuthenticatedRequest<JwtPayload>
  ): Promise<HousePerformanceResponseDto> {
    return this.housesAnalyticsService.getHousesPerformance(query, req.user.sub)
  }
}
