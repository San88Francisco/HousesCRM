import { IntersectionType, PartialType, PickType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsOptional, Min } from 'class-validator'
import { QueryDto } from 'src/common/dto/query.dto'
import { CurrencyCode } from 'src/exchange-rates/entities/exchange-rate.entity'
import { HouseDto } from './house.dto'

export class HouseQueryDto extends IntersectionType(
  PartialType(PickType(HouseDto, ['apartmentType', 'roomsCount', 'floor'] as const)),
  QueryDto
) {
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  minPrice?: number

  @IsOptional()
  @Min(2)
  @Type(() => Number)
  maxPrice?: number

  @IsOptional()
  @IsEnum(CurrencyCode)
  currency?: CurrencyCode
}
