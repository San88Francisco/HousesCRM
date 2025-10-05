import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { HOUSES_ROUTES } from './constants/houses.routes'
import { CreateHouseDto } from './dto/create-house.dto'
import { HousesService } from './houses.service'
import { UpdateHouseDto } from './dto/update-house.dto'
import { DeleteHouseDto } from './dto/delete-house.dto'
import { HouseWithRelationsDto } from './dto/house-with-relations.dto'
import { HouseResponseDto } from './dto/houses-response.dto'
import { HouseQueryDto } from './dto/house-query.dto'
import { HousesAnalyticsService } from 'src/analytics/houses-analytics/houses-analytics.service'
import { AllHousesAnalyticsDto } from 'src/analytics/houses-analytics/dto/all-houses-analytics.dto'
import { HouseOverviewDto } from 'src/analytics/houses-analytics/dto/houses-overview/houses-overview.dto'
import { RevenueDistributionDto } from 'src/analytics/houses-analytics/dto/revenue-distribution/revenue-distribution.dto'
import { HousePaybackStatsDto } from 'src/analytics/houses-analytics/dto/house-payback-stats/house-payback-stats.dto'
import { CurrencyRevaluationDto } from 'src/analytics/houses-analytics/dto/currency-revaluation/currency-revaluation.dto'
import { HousePerformanceResponseDto } from 'src/analytics/houses-analytics/dto/house-performance/house-performance-response.dto'
import { HousesOverviewQueryDto } from 'src/analytics/houses-analytics/dto/houses-overview/houses-overview-query.dto'

@Controller(HOUSES_ROUTES.ROOT)
export class HousesController {
  constructor(
    private readonly housesService: HousesService,
    private readonly housesAnalyticsService: HousesAnalyticsService
  ) {}

  @Get()
  public findAll(@Query() dto: HouseQueryDto): Promise<HouseResponseDto> {
    return this.housesService.findAll(dto)
  }

  @Get(HOUSES_ROUTES.ANALYTICS)
  public async getHousesAnalytics(): Promise<AllHousesAnalyticsDto> {
    return await this.housesAnalyticsService.getAllHousesAnalytics()
  }

  @Get(HOUSES_ROUTES.HOUSES_OVERVIEW_ANALYTIC)
  public async getHousesOverview(@Query() query: HousesOverviewQueryDto): Promise<HouseOverviewDto[]> {
    return this.housesAnalyticsService.getHousesOverview(query)
  }

  @Get(HOUSES_ROUTES.REVENUE_DESTRIBUTION_ANALYTIC)
  public async getRevenueDistribution(): Promise<RevenueDistributionDto> {
    return await this.housesAnalyticsService.getRevenueDistribution()
  }

  @Get(HOUSES_ROUTES.HOUSE_PAYBACK_STATS_ANALYTIC)
  public async getHousePaybackStats(): Promise<HousePaybackStatsDto[]> {
    return await this.housesAnalyticsService.getHousePaybackStats()
  }

  @Get(HOUSES_ROUTES.CURRENCY_REVALUATION_ANALYTIC)
  public async getCurrencyRevaluation(): Promise<CurrencyRevaluationDto[]> {
    return await this.housesAnalyticsService.getCurrencyRevaluation()
  }

  @Get(HOUSES_ROUTES.HOUSES_PERFORMANCE_ANALYTIC)
  public async getHousesPerformance(): Promise<HousePerformanceResponseDto> {
    return await this.housesAnalyticsService.getHousesPerformance({ page: 1, limit: 10 })
  }

  @Get(HOUSES_ROUTES.BY_ID)
  public findById(@Param('id') id: string): Promise<HouseWithRelationsDto> {
    return this.housesService.findById(id)
  }

  @Post()
  public async create(@Body() dto: CreateHouseDto): Promise<HouseWithRelationsDto> {
    return await this.housesService.create(dto)
  }

  @Patch(HOUSES_ROUTES.BY_ID)
  public async update(@Body() dto: UpdateHouseDto, @Param('id') id: string): Promise<HouseWithRelationsDto> {
    return await this.housesService.update(dto, id)
  }

  @Delete(HOUSES_ROUTES.BY_ID)
  public async remove(@Param('id') id: string): Promise<DeleteHouseDto> {
    await this.housesService.remove(id)
    return { message: 'House successfully deleted' }
  }
}
