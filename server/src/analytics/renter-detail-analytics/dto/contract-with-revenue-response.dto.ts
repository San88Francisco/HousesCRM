import { Expose, Type } from 'class-transformer'
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto'
import { ContractWithRevenueDto } from './contract-with-revenue.dto'

export class ContractWithRevenueResponseDto {
  @Expose()
  data: ContractWithRevenueDto[]

  @Expose()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto
}
