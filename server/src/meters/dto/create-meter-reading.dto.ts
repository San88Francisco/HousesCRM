import { Type } from 'class-transformer'
import { IsDate, IsDefined, IsEnum, IsNumber, IsOptional, Min } from 'class-validator'
import { UtilityType } from '../entities/utility-type.enum'

export class CreateMeterReadingDto {
  @IsOptional()
  @IsNumber({}, { message: 'value must be a number' })
  @Min(0, { message: 'value must not be negative' })
  value?: number

  @IsDefined({ message: 'readingDate is required' })
  @IsDate({ message: 'readingDate must be a date' })
  @Type(() => Date)
  readingDate: Date

  @IsOptional()
  @IsEnum(UtilityType, { message: 'utilityType must be a valid enum value' })
  utilityType?: UtilityType
}
