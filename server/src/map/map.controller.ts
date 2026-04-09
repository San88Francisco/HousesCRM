import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { Auth } from 'src/common/decorators/auth.decorator'
import { BulkPoiQueryDto } from './dto/bulk-poi-query.dto'
import { GeocodeQueryDto } from './dto/geocode-query.dto'
import type { GeocodeResult, POI } from './dto/poi.dto'
import { PoiQueryDto } from './dto/poi-query.dto'
import { MapService } from './map.service'
import { MAP_ROUTES } from './constants/map.routes'

@Controller(MAP_ROUTES.ROOT)
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get(MAP_ROUTES.POI)
  @Auth()
  getPoi(@Query() dto: PoiQueryDto): Promise<POI[]> {
    return this.mapService.getPoi(dto.lat, dto.lng)
  }

  @Post(MAP_ROUTES.POI_BULK)
  @Auth()
  getBulkPoi(@Body() dto: BulkPoiQueryDto): Promise<POI[]> {
    return this.mapService.getBulkPoi(dto.points)
  }

  @Get(MAP_ROUTES.GEOCODE)
  @Auth()
  geocode(@Query() dto: GeocodeQueryDto): Promise<GeocodeResult | null> {
    return this.mapService.geocode(dto.street)
  }
}
