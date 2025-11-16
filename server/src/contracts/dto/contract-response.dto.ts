import { Expose, Type } from 'class-transformer'
import { ContractDto } from './contract.dto'
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto'

export class ContractResponseDto {
  @Expose()
  data: ContractDto[]

  @Expose()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto
}
