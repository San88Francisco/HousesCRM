import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { HouseDetailAnalyticsService } from 'src/analytics/house-detail-analytics/house-detail-analytics.service'
import { Auth } from 'src/common/decorators/auth.decorator'
import { HOUSES_ROUTES } from './constants/houses.routes'
import { CreateHouseDto } from './dto/create-house.dto'
import { DeleteHouseDto } from './dto/delete-house.dto'
import { HouseOccupancyQueryDto } from './dto/house-occupancy-query.dto'
import { HouseOccupancyReportResponseDto } from './dto/house-occupancy-report-response.dto'
import { HouseQueryDto } from './dto/house-query.dto'
import { HouseWithOccupancyReports } from './dto/house-with-occupancy-reports.dto'
import { HouseWithRelationsDto } from './dto/house-with-relations.dto'
import { HouseResponseDto } from './dto/houses-response.dto'
import { UpdateHouseDto } from './dto/update-house.dto'
import { HousesService } from './houses.service'

@Controller(HOUSES_ROUTES.ROOT)
export class HousesController {
  constructor(
    private readonly housesService: HousesService,
    private readonly houseDetailAnalytics: HouseDetailAnalyticsService
  ) {}

  @Get()
  @Auth()
  findAll(@Query() dto: HouseQueryDto): Promise<HouseResponseDto> {
    return this.housesService.findAll(dto)
  }

  @Get(HOUSES_ROUTES.BY_ID_OCCUPANCY)
  @Auth()
  async getHouseOccupancyReport(
    @Param('id') id: string,
    @Query() dto: HouseOccupancyQueryDto
  ): Promise<HouseOccupancyReportResponseDto> {
    return this.houseDetailAnalytics.getHouseOccupancyReportList(id, dto)
  }

  @Get(HOUSES_ROUTES.BY_ID)
  @Auth()
  async findById(@Param('id') id: string, @Query() dto: HouseOccupancyQueryDto): Promise<HouseWithOccupancyReports> {
    const [houseDetail, occupancyReports] = await Promise.all([
      this.housesService.findById(id),
      this.houseDetailAnalytics.getHouseOccupancyReportList(id, dto),
    ])

    return { houseDetail, occupancyReports }
  }

  @Post()
  @Auth()
  async create(@Body() dto: CreateHouseDto): Promise<HouseWithRelationsDto> {
    return await this.housesService.create(dto)
  }

  @Patch(HOUSES_ROUTES.BY_ID)
  @Auth()
  async update(@Body() dto: UpdateHouseDto, @Param('id') id: string): Promise<HouseWithRelationsDto> {
    return await this.housesService.update(dto, id)
  }

  @Delete(HOUSES_ROUTES.BY_ID)
  @Auth()
  async remove(@Param('id') id: string): Promise<DeleteHouseDto> {
    await this.housesService.remove(id)
    return { message: 'House successfully deleted' }
  }
}
