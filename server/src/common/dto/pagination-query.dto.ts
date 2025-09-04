import { Type } from 'class-transformer'
import { IsOptional, Min } from 'class-validator'

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  public page?: number

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  public limit?: number
}
