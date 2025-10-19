import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { HOUSES_ROUTES } from './constants/houses.routes'
import { CreateHouseDto } from './dto/create-house.dto'
import { HousesService } from './houses.service'
import { UpdateHouseDto } from './dto/update-house.dto'
import { DeleteHouseDto } from './dto/delete-house.dto'
import { HouseWithRelationsDto } from './dto/house-with-relations.dto'
import { HouseResponseDto } from './dto/houses-response.dto'
import { HouseQueryDto } from './dto/house-query.dto'

@Controller(HOUSES_ROUTES.ROOT)
export class HousesController {
  constructor(private readonly housesService: HousesService) {}

  @Get()
  findAll(@Query() dto: HouseQueryDto): Promise<HouseResponseDto> {
    return this.housesService.findAll(dto)
  }

  @Get(HOUSES_ROUTES.BY_ID)
  findById(@Param('id') id: string): Promise<HouseWithRelationsDto> {
    return this.housesService.findById(id)
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
