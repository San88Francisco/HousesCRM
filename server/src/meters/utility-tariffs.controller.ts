import { Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common'
import type { AuthenticatedRequest } from 'src/auth/types'
import { Auth } from 'src/common/decorators/auth.decorator'
import type { JwtPayload } from 'types/jwt/jwt.types'
import { UTILITY_TARIFFS_ROUTES } from './constants/meters.routes'
import { CreateUtilityTariffDto } from './dto/create-utility-tariff.dto'
import { DeleteMeterResponseDto } from './dto/delete-meter-response.dto'
import { MeterReadingQueryDto } from './dto/meter-reading-query.dto'
import { UtilityTariffDto } from './dto/utility-tariff.dto'
import { UtilityTariffsService } from './utility-tariffs.service'

@Controller(UTILITY_TARIFFS_ROUTES.ROOT)
export class UtilityTariffsController {
  constructor(private readonly utilityTariffsService: UtilityTariffsService) {}

  @Get()
  @Auth()
  findAll(
    @Query() dto: MeterReadingQueryDto,
    @Req() req: AuthenticatedRequest<JwtPayload>
  ): Promise<UtilityTariffDto[]> {
    return this.utilityTariffsService.findAll(req.user.sub, dto.utilityType)
  }

  @Post()
  @Auth()
  create(@Body() dto: CreateUtilityTariffDto, @Req() req: AuthenticatedRequest<JwtPayload>): Promise<UtilityTariffDto> {
    return this.utilityTariffsService.create(dto, req.user.sub)
  }

  @Delete(UTILITY_TARIFFS_ROUTES.BY_ID)
  @Auth()
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest<JwtPayload>): Promise<DeleteMeterResponseDto> {
    await this.utilityTariffsService.remove(id, req.user.sub)
    return { message: 'Тариф успішно видалено' }
  }
}
