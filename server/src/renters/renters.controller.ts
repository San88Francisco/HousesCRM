import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { RentersService } from './renters.service'
import { RENTERS_ROUTES } from './constants/renters.routes'
import { RenterWithContractDto } from './dto/renter-with-contracts.dto'
import { CreateRenterDto } from './dto/create-renter.dto'
import { UpdateRenterDto } from './dto/update-renter.dto'
import { DeleteRenterDto } from './dto/delete-renter.dto'
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto'
import { PaginatedRenterResponseDto } from './dto/paginated-renter-response.dto'

@Controller(RENTERS_ROUTES.ROOT)
export class RentersController {
  constructor(private readonly rentersService: RentersService) {}

  @Get()
  public async findAll(@Query() dto: PaginationQueryDto): Promise<PaginatedRenterResponseDto> {
    return this.rentersService.findAll(dto)
  }

  @Get(RENTERS_ROUTES.BY_ID)
  public async findById(@Param('id') id: string): Promise<RenterWithContractDto> {
    return this.rentersService.findById(id)
  }

  @Post()
  public async create(@Body() renterDto: CreateRenterDto): Promise<RenterWithContractDto> {
    return this.rentersService.create(renterDto)
  }

  @Patch(RENTERS_ROUTES.BY_ID)
  public async update(@Body() renterDto: UpdateRenterDto, @Param('id') id: string): Promise<RenterWithContractDto> {
    return this.rentersService.update(renterDto, id)
  }

  @Delete(RENTERS_ROUTES.BY_ID)
  public async remove(@Param('id') id: string): Promise<DeleteRenterDto> {
    await this.rentersService.remove(id)
    return { message: 'Renter deleted successfully' }
  }
}
