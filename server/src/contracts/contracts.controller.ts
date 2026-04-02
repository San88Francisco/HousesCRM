import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common'
import type { AuthenticatedRequest } from 'src/auth/types'
import { Auth } from 'src/common/decorators/auth.decorator'
import { QueryDto } from 'src/common/dto/query.dto'
import type { JwtPayload } from 'types/jwt/jwt.types'
import { CONTRACTS_ROUTES } from './constants/contracts.routes'
import { ContractsService } from './contracts.service'
import { ContractPdfFileDto } from './dto/contract-pdf-file.dto'
import { ContractResponseDto } from './dto/contract-response.dto'
import { ContractWithRelationsDto } from './dto/contract-with-relations.dto'
import { CreateContractDto } from './dto/create-contract.dto'
import { DeleteContractDto } from './dto/delete-contract.dto'
import { UpdateContractDto } from './dto/update-contract-dto'

@Controller(CONTRACTS_ROUTES.ROOT)
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  @Auth()
  async findAll(@Query() dto: QueryDto, @Req() req: AuthenticatedRequest<JwtPayload>): Promise<ContractResponseDto> {
    return await this.contractsService.findAll(dto, req.user.sub)
  }

  @Get(CONTRACTS_ROUTES.BY_ID)
  @Auth()
  async findById(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest<JwtPayload>
  ): Promise<ContractWithRelationsDto> {
    return await this.contractsService.findById(id, req.user.sub)
  }

  @Get(CONTRACTS_ROUTES.PDF_FILE)
  @Auth()
  async getPdfFile(@Param('id') id: string, @Req() req: AuthenticatedRequest<JwtPayload>): Promise<ContractPdfFileDto> {
    return await this.contractsService.getPdfFileData(id, req.user.sub)
  }

  @Post()
  @Auth()
  async create(
    @Body() dto: CreateContractDto,
    @Req() req: AuthenticatedRequest<JwtPayload>
  ): Promise<ContractWithRelationsDto> {
    return await this.contractsService.create(dto, req.user.sub)
  }

  @Patch(CONTRACTS_ROUTES.BY_ID)
  @Auth()
  async update(
    @Body() dto: UpdateContractDto,
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest<JwtPayload>
  ): Promise<ContractWithRelationsDto> {
    return await this.contractsService.update(dto, id, req.user.sub)
  }

  @Delete(CONTRACTS_ROUTES.BY_ID)
  @Auth()
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest<JwtPayload>): Promise<DeleteContractDto> {
    await this.contractsService.remove(id, req.user.sub)
    return { message: 'Contract deleted successfully' }
  }
}
