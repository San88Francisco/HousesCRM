import { Expose, Type } from 'class-transformer'
import { IsEnum, IsOptional, Min } from 'class-validator'
import { SortOrder } from 'src/common/enums/sort-order.enum'

export class QueryDto {
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  public page?: number

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  public limit?: number

  @IsOptional()
  @Expose()
  public sortBy?: string

  @IsOptional()
  @Expose()
  @IsEnum(SortOrder)
  public order?: SortOrder
}
