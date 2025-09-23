import { QueryDto } from 'src/common/dto/query.dto'
import { HouseDto } from './house.dto'
import { IntersectionType, PartialType, PickType } from '@nestjs/swagger'
import { IsEnum, IsOptional, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { CurrencyCode } from 'src/house-prices/entities/house-price.entity'

export class HouseQueryDto extends IntersectionType(
  PartialType(PickType(HouseDto, ['apartmentType', 'roomsCount', 'floor'] as const)),
  QueryDto
) {
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  public minPrice?: number

  @IsOptional()
  @Min(2)
  @Type(() => Number)
  public maxPrice?: number

  @IsOptional()
  @IsEnum(CurrencyCode)
  public currency?: CurrencyCode
}
