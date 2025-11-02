import { Type } from 'class-transformer'
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsDefined,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator'

export class CreateRenterDto {
  @IsDefined({ message: 'FirstName is required' })
  @IsString({ message: 'FirstName must be a string' })
  @MinLength(2)
  @MaxLength(15)
  public firstName: string

  @IsDefined({ message: 'LastName is required' })
  @IsString({ message: 'LastName must be a string' })
  @MinLength(2)
  @MaxLength(30)
  public lastName: string

  @IsDefined({ message: 'Occupied is required' })
  @IsDate({ message: 'Occupied must be a valid date' })
  @Type(() => Date)
  public occupied: Date

  @IsOptional()
  @IsDate({ message: 'Vacated must be a valid date' })
  @Type(() => Date)
  public vacated?: Date

  @IsOptional()
  @IsArray({ message: 'contractIds must be an array' })
  @ArrayNotEmpty({ message: 'contractIds must not be empty' })
  @IsUUID('4', { each: true, message: 'contractId must be a valid UUID' })
  public contractIds?: string[]
}
