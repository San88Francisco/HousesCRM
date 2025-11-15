import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { RentersService } from './renters.service'
import { RENTERS_ROUTES } from './constants/renters.routes'
import { RenterWithContractDto } from './dto/renter-with-contracts.dto'
import { CreateRenterDto } from './dto/create-renter.dto'
import { UpdateRenterDto } from './dto/update-renter.dto'
import { DeleteRenterDto } from './dto/delete-renter.dto'
import { QueryDto } from 'src/common/dto/query.dto'
import { RenterResponseDto } from './dto/renter-response.dto'
import { RenterDetailAnalyticsService } from 'src/analytics/renter-detail-analytics/renter-detail-analytics.service'
import { AllRenterAnalyticDto } from 'src/analytics/renter-detail-analytics/dto/all-renter-analytic-response.dto'
import { Auth } from 'src/common/decorators/auth.decorator'

@Controller(RENTERS_ROUTES.ROOT)
export class RentersController {
  constructor(
    private readonly rentersService: RentersService,
    private readonly rentersAnalyticService: RenterDetailAnalyticsService
  ) {}

  @Get()
  @Auth()
  async findAll(@Query() dto: QueryDto): Promise<RenterResponseDto> {
    return this.rentersService.findAll(dto)
  }

  @Get(RENTERS_ROUTES.BY_ID)
  @Auth()
  public async findById(@Param('id') id: string): Promise<AllRenterAnalyticDto> {
    return await this.rentersAnalyticService.getAllRenterAnalytic(id)
  }

  @Post()
  @Auth()
  async create(@Body() renterDto: CreateRenterDto): Promise<RenterWithContractDto> {
    return this.rentersService.create(renterDto)
  }

  @Patch(RENTERS_ROUTES.BY_ID)
  @Auth()
  async update(@Body() renterDto: UpdateRenterDto, @Param('id') id: string): Promise<RenterWithContractDto> {
    return this.rentersService.update(renterDto, id)
  }

  @Delete(RENTERS_ROUTES.BY_ID)
  @Auth()
  async remove(@Param('id') id: string): Promise<DeleteRenterDto> {
    await this.rentersService.remove(id)
    return { message: 'Renter deleted successfully' }
  }
}
