import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common'
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
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { CACHE_KEY, TTL } from 'src/analytics/houses-analytics/constants/cache'
import { HouseDetailAnalyticsService } from 'src/analytics/house-detail-analytics/house-detail-analytics.service'
import { HouseWithOccupancyReports } from './dto/house-with-occupancy-reports.dto'

@Controller(HOUSES_ROUTES.ROOT)
export class HousesController {
  constructor(
    private readonly housesService: HousesService,
    private readonly housesAnalyticsService: HousesAnalyticsService,
    private readonly houseDetailAnalytics: HouseDetailAnalyticsService
  ) {}

  @Get()
  findAll(@Query() dto: HouseQueryDto): Promise<HouseResponseDto> {
    return this.housesService.findAll(dto)
  }

  @Get(HOUSES_ROUTES.ANALYTICS)
  @UseInterceptors(CacheInterceptor)
  @CacheKey(CACHE_KEY)
  @CacheTTL(TTL)
  async getHousesAnalytics(): Promise<AllHousesAnalyticsDto> {
    return await this.housesAnalyticsService.getAllHousesAnalytics()
  }

  @Get(HOUSES_ROUTES.BY_ID)
  public async findById(@Param('id') id: string): Promise<HouseWithOccupancyReports> {
    const [houseDetail, occupancyReports] = await Promise.all([
      this.housesService.findById(id),
      this.houseDetailAnalytics.getHouseOccupancyReport(id),
    ])

    return { houseDetail, occupancyReports }
  }

  @Post()
  async create(@Body() dto: CreateHouseDto): Promise<HouseWithRelationsDto> {
    return await this.housesService.create(dto)
  }

  @Patch(HOUSES_ROUTES.BY_ID)
  async update(@Body() dto: UpdateHouseDto, @Param('id') id: string): Promise<HouseWithRelationsDto> {
    return await this.housesService.update(dto, id)
  }

  @Delete(HOUSES_ROUTES.BY_ID)
  async remove(@Param('id') id: string): Promise<DeleteHouseDto> {
    await this.housesService.remove(id)
    return { message: 'House successfully deleted' }
  }
}
