import { Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common'
import type { AuthenticatedRequest } from 'src/auth/types'
import { Auth } from 'src/common/decorators/auth.decorator'
import type { JwtPayload } from 'types/jwt/jwt.types'
import { METER_READINGS_ROUTES } from './constants/meters.routes'
import { CreateMeterReadingDto } from './dto/create-meter-reading.dto'
import { DeleteMeterResponseDto } from './dto/delete-meter-response.dto'
import { MeterReadingQueryDto } from './dto/meter-reading-query.dto'
import { MeterReadingDto } from './dto/meter-reading.dto'
import { MeterReadingsResponseDto } from './dto/meter-readings-response.dto'
import { UtilitySummaryResponseDto } from './dto/utility-summary.dto'
import { MeterReadingsService } from './meter-readings.service'

@Controller(METER_READINGS_ROUTES.ROOT)
export class MeterReadingsController {
  constructor(private readonly meterReadingsService: MeterReadingsService) {}

  @Get()
  @Auth()
  findAll(
    @Param('houseId') houseId: string,
    @Query() dto: MeterReadingQueryDto,
    @Req() req: AuthenticatedRequest<JwtPayload>
  ): Promise<MeterReadingsResponseDto> {
    return this.meterReadingsService.findAll(houseId, req.user.sub, dto.utilityType)
  }

  @Get(METER_READINGS_ROUTES.SUMMARY)
  @Auth()
  getSummary(
    @Param('houseId') houseId: string,
    @Req() req: AuthenticatedRequest<JwtPayload>
  ): Promise<UtilitySummaryResponseDto> {
    return this.meterReadingsService.getSummary(houseId, req.user.sub)
  }

  @Post()
  @Auth()
  create(
    @Param('houseId') houseId: string,
    @Body() dto: CreateMeterReadingDto,
    @Req() req: AuthenticatedRequest<JwtPayload>
  ): Promise<MeterReadingDto> {
    return this.meterReadingsService.create(houseId, dto, req.user.sub)
  }

  @Delete(METER_READINGS_ROUTES.BY_ID)
  @Auth()
  async remove(
    @Param('houseId') houseId: string,
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest<JwtPayload>
  ): Promise<DeleteMeterResponseDto> {
    await this.meterReadingsService.remove(id, houseId, req.user.sub)
    return { message: 'Показник успішно видалено' }
  }
}
