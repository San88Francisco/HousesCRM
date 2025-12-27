import { Expose, Type } from 'class-transformer'
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto'
import { ContractWithCurrenciesDto } from './contract-with-currencies.dto'

export class ContractResponseDto {
  @Expose()
  @Type(() => ContractWithCurrenciesDto)
  data: ContractWithCurrenciesDto[]

  @Expose()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto
}
