import { Expose, Type } from 'class-transformer'
import { HouseOverviewDto } from './houses-overview/houses-overview.dto'
import { RevenueDistributionDto } from './revenue-distribution/revenue-distribution.dto'
import { HousePaybackStatsDto } from './house-payback-stats/house-payback-stats.dto'
import { CurrencyRevaluationDto } from './currency-revaluation/currency-revaluation.dto'
import { HousePerformanceResponseDto } from './house-performance/house-performance-response.dto'

export class AllHousesAnalyticsDto {
  @Expose()
  @Type(() => HouseOverviewDto)
  public housesOverview: HouseOverviewDto[]

  @Expose()
  @Type(() => RevenueDistributionDto)
  public revenueDistribution: RevenueDistributionDto

  @Expose()
  @Type(() => HousePaybackStatsDto)
  public housesPaybackStats: HousePaybackStatsDto[]

  @Expose()
  @Type(() => CurrencyRevaluationDto)
  public currencyRevaluation: CurrencyRevaluationDto[]

  @Expose()
  @Type(() => HousePerformanceResponseDto)
  public housesPerformance: HousePerformanceResponseDto
}
