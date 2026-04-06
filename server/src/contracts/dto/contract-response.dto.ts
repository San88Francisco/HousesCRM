import { Expose, Type } from 'class-transformer'
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto'
import { ContractWithRelationsDto } from './contract-with-relations.dto'

export class ContractResponseDto {
  @Expose()
  @Type(() => ContractWithRelationsDto)
  data: ContractWithRelationsDto[]

  @Expose()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto
}
