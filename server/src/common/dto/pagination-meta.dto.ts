import { Expose, Transform } from 'class-transformer'

export class PaginationMetaDto {
  @Expose()
  total: number

  @Expose()
  page: number

  @Expose()
  limit: number

  @Expose()
  @Transform(({ obj }: { obj: PaginationMetaDto }) => Math.ceil(obj.total / obj.limit))
  totalPages: number

  @Expose()
  @Transform(({ obj }: { obj: PaginationMetaDto }) => obj.page < Math.ceil(obj.total / obj.limit))
  hasNextPage: boolean

  @Expose()
  @Transform(({ obj }: { obj: PaginationMetaDto }) => obj.page > 1)
  hasPreviousPage: boolean
}
