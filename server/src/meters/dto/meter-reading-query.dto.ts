import { IsEnum, IsOptional } from 'class-validator'
import { UtilityType } from '../entities/utility-type.enum'

export class MeterReadingQueryDto {
  @IsOptional()
  @IsEnum(UtilityType, { message: 'utilityType must be a valid enum value' })
  utilityType?: UtilityType
}
