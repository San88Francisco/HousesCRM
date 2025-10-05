import { IsISO8601, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'

export class HousesOverviewQueryDto {
  @IsOptional()
  @IsISO8601()
  @Transform(({ value }: { value: Date }) => (value ? new Date(value).toISOString() : undefined))
  public dateFrom?: string

  @IsOptional()
  @IsISO8601()
  @Transform(({ value }: { value: Date }) => (value ? new Date(value).toISOString() : undefined))
  public dateTo?: string
}
