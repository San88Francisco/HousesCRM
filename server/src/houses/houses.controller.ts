import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { HOUSES_ROUTES } from './constants/houses.routes'
import { CreateHouseDto } from './dto/create-house.dto'
import { HousesService } from './houses.service'
import { HouseDto } from './dto/house.dto'
import { UpdateHouseDto } from './dto/update-house.dto'
import { DeleteHouseDto } from './dto/delete-house.dto'
import { HouseWithPricesDto } from './dto/house-with-prices.dto'

@Controller(HOUSES_ROUTES.ROOT)
export class HousesController {
  constructor(private readonly housesService: HousesService) {}

  @Get()
  public findAll(): Promise<HouseDto[]> {
    return this.housesService.findAll()
  }

  @Get(HOUSES_ROUTES.BY_ID)
  public findById(@Param('id') id: string): Promise<HouseWithPricesDto> {
    return this.housesService.findById(id)
  }

  @Post()
  public async create(@Body() dto: CreateHouseDto): Promise<HouseWithPricesDto> {
    // TODO: get userId from access token when authorization is implemented
    return await this.housesService.create(dto, '7973aae3-5684-40ec-92a6-e832ad393f26')
  }

  @Patch(HOUSES_ROUTES.BY_ID)
  public async update(@Body() dto: UpdateHouseDto, @Param('id') id: string): Promise<HouseWithPricesDto> {
    return await this.housesService.update(dto, id)
  }

  @Delete(HOUSES_ROUTES.BY_ID)
  public async remove(@Param('id') id: string): Promise<DeleteHouseDto> {
    await this.housesService.remove(id)
    return { message: 'House successfully deleted' }
  }
}
