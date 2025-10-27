import { Expose, Type } from 'class-transformer'
import { HouseOverviewDto } from './houses-overview/houses-overview.dto'
import { RevenueDistributionDto } from './revenue-distribution/revenue-distribution.dto'
import { HousePaybackStatsDto } from './house-payback-stats/house-payback-stats.dto'
import { CurrencyRevaluationDto } from './currency-revaluation/currency-revaluation.dto'
import { HousePerformanceResponseDto } from './house-performance/house-performance-response.dto'

export class AllHousesAnalyticsDto {
  @Expose()
  @Type(() => HouseOverviewDto)
  housesOverview: HouseOverviewDto[]

  @Expose()
  @Type(() => RevenueDistributionDto)
  revenueDistribution: RevenueDistributionDto

  @Expose()
  @Type(() => HousePaybackStatsDto)
  housesPaybackStats: HousePaybackStatsDto[]

  @Expose()
  @Type(() => CurrencyRevaluationDto)
  currencyRevaluation: CurrencyRevaluationDto[]

  @Expose()
  @Type(() => HousePerformanceResponseDto)
  housesPerformance: HousePerformanceResponseDto
}
