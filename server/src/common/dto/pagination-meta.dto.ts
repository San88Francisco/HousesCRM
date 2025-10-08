import { Expose, Transform } from 'class-transformer'

export class PaginationMetaDto {
  @Expose()
  public total: number

  @Expose()
  public page: number

  @Expose()
  public limit: number

  @Expose()
  @Transform(({ obj }: { obj: PaginationMetaDto }) => Math.ceil(obj.total / obj.limit))
  public totalPages: number

  @Expose()
  @Transform(({ obj }: { obj: PaginationMetaDto }) => obj.page < Math.ceil(obj.total / obj.limit))
  public hasNextPage: boolean

  @Expose()
  @Transform(({ obj }: { obj: PaginationMetaDto }) => obj.page > 1)
  public hasPreviousPage: boolean
}
