import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ContractsService } from './contracts.service'
import { CONTRACTS_ROUTES } from './constants/contracts.routes'
import { CreateContractDto } from './dto/create-contract.dto'
import { ContractWithRelationsDto } from './dto/contract-with-relations.dto'
import { UpdateContractDto } from './dto/update-contract-dto'
import { DeleteContractDto } from './dto/delete-contract.dto'
import { ContractResponseDto } from './dto/contract-response.dto'
import { QueryDto } from 'src/common/dto/query.dto'
import { Auth } from 'src/common/decorators/auth.decorator'
import { ContractPdfFileDto } from './dto/contract-pdf-file.dto'

@Controller(CONTRACTS_ROUTES.ROOT)
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  @Auth()
  async findAll(@Query() dto: QueryDto): Promise<ContractResponseDto> {
    return await this.contractsService.findAll(dto)
  }

  @Get(CONTRACTS_ROUTES.BY_ID)
  @Auth()
  async findById(@Param('id') id: string): Promise<ContractWithRelationsDto> {
    return await this.contractsService.findById(id)
  }

  @Get(CONTRACTS_ROUTES.PDF_FILE)
  @Auth()
  async getPdfFile(@Param('id') id: string): Promise<ContractPdfFileDto> {
    return await this.contractsService.getPdfFileData(id)
  }

  @Post()
  @Auth()
  async create(@Body() dto: CreateContractDto): Promise<ContractWithRelationsDto> {
    return await this.contractsService.create(dto)
  }

  @Patch(CONTRACTS_ROUTES.BY_ID)
  @Auth()
  async update(@Body() dto: UpdateContractDto, @Param('id') id: string): Promise<ContractWithRelationsDto> {
    return await this.contractsService.update(dto, id)
  }

  @Delete(CONTRACTS_ROUTES.BY_ID)
  @Auth()
  async remove(@Param('id') id: string): Promise<DeleteContractDto> {
    await this.contractsService.remove(id)
    return { message: 'Contract deleted successfully' }
  }
}
