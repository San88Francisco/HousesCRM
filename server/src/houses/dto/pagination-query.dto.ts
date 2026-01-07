import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator'
import { QUERY_DEFAULTS } from 'src/common/constants/query.constant'

export class PaginationQueryDto {
  @ApiPropertyOptional({ example: QUERY_DEFAULTS.PAGE })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = QUERY_DEFAULTS.PAGE

  @ApiPropertyOptional({ example: QUERY_DEFAULTS.LIMIT })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number = QUERY_DEFAULTS.LIMIT
}
