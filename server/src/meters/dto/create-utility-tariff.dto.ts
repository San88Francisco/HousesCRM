import { Type } from 'class-transformer'
import { IsDate, IsDefined, IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator'
import { UtilityType } from '../entities/utility-type.enum'

export class CreateUtilityTariffDto {
  @IsDefined({ message: 'pricePerUnit is required' })
  @IsNumber({}, { message: 'pricePerUnit must be a number' })
  @IsPositive({ message: 'pricePerUnit must be positive' })
  pricePerUnit: number

  @IsDefined({ message: 'validFrom is required' })
  @IsDate({ message: 'validFrom must be a date' })
  @Type(() => Date)
  validFrom: Date

  @IsOptional()
  @IsEnum(UtilityType, { message: 'utilityType must be a valid enum value' })
  utilityType?: UtilityType
}
