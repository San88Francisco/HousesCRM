import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req } from '@nestjs/common'
import type { AuthenticatedRequest } from 'src/auth/types'
import type { JwtPayload } from 'types/jwt/jwt.types'
import { AllRenterAnalyticDto } from 'src/analytics/renter-detail-analytics/dto/all-renter-analytic-response.dto'
import { ContractQueryDto } from 'src/analytics/renter-detail-analytics/dto/contract-query.dto'
import { ContractWithRevenueResponseDto } from 'src/analytics/renter-detail-analytics/dto/contract-with-revenue-response.dto'
import { RenterDetailAnalyticsService } from 'src/analytics/renter-detail-analytics/renter-detail-analytics.service'
import { Auth } from 'src/common/decorators/auth.decorator'
import { RENTERS_ROUTES } from './constants/renters.routes'
import { CreateRenterDto } from './dto/create-renter.dto'
import { DeleteRenterDto } from './dto/delete-renter.dto'
import { RenterQueryDto } from './dto/renter-query.dto'
import { RenterResponseDto } from './dto/renter-response.dto'
import { RenterWithContractDto } from './dto/renter-with-contracts.dto'
import { UpdateRenterDto } from './dto/update-renter.dto'
import { RentersService } from './renters.service'

@Controller(RENTERS_ROUTES.ROOT)
export class RentersController {
  constructor(
    private readonly rentersService: RentersService,
    private readonly rentersAnalyticService: RenterDetailAnalyticsService
  ) {}

  @Get()
  @Auth()
  async findAll(
    @Query() dto: RenterQueryDto,
    @Req() req: AuthenticatedRequest<JwtPayload>
  ): Promise<RenterResponseDto> {
    return this.rentersService.findAll(dto, req.user.sub)
  }

  @Get(RENTERS_ROUTES.CONTRACTS_BY_RENTER_ID)
  @Auth()
  async getContractsByRenterId(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() dto: ContractQueryDto,
    @Req() req: AuthenticatedRequest<JwtPayload>
  ): Promise<ContractWithRevenueResponseDto> {
    return await this.rentersAnalyticService.getAllContractsByRenterId(id, req.user.sub, dto)
  }

  @Get(RENTERS_ROUTES.BY_ID)
  @Auth()
  async findById(
    @Param('id') id: string,
    @Query() dto: ContractQueryDto,
    @Req() req: AuthenticatedRequest<JwtPayload>
  ): Promise<AllRenterAnalyticDto> {
    return await this.rentersAnalyticService.getAllRenterAnalytic(id, req.user.sub, dto)
  }

  @Post()
  @Auth()
  async create(
    @Body() renterDto: CreateRenterDto,
    @Req() req: AuthenticatedRequest<JwtPayload>
  ): Promise<RenterWithContractDto> {
    return this.rentersService.create(renterDto, req.user.sub)
  }

  @Patch(RENTERS_ROUTES.BY_ID)
  @Auth()
  async update(
    @Body() renterDto: UpdateRenterDto,
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest<JwtPayload>
  ): Promise<RenterWithContractDto> {
    return this.rentersService.update(renterDto, id, req.user.sub)
  }

  @Delete(RENTERS_ROUTES.BY_ID)
  @Auth()
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest<JwtPayload>): Promise<DeleteRenterDto> {
    await this.rentersService.remove(id, req.user.sub)
    return { message: 'Renter deleted successfully' }
  }
}
