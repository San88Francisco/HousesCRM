import { Expose, Type } from 'class-transformer'
import { ContractDto } from './contract.dto'
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto'

export class PaginatedContractResponseDto {
  @Expose()
  public data: ContractDto[]

  @Expose()
  @Type(() => PaginationMetaDto)
  public meta: PaginationMetaDto
}
