import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator'

export class CreateRenterDto {
  @IsDefined({ message: 'FirstName is required' })
  @IsString({ message: 'FirstName must be a string' })
  @MinLength(2)
  @MaxLength(15)
  firstName: string

  @IsDefined({ message: 'LastName is required' })
  @IsString({ message: 'LastName must be a string' })
  @MinLength(2)
  @MaxLength(30)
  lastName: string

  @IsDefined({ message: 'Age is required' })
  @IsInt({ message: 'Age must be an integer' })
  @Min(18, { message: 'Age must be at least 18' })
  @Max(100, { message: 'Age must be at most 100' })
  age: number

  @IsOptional()
  @IsArray({ message: 'contractIds must be an array' })
  @ArrayNotEmpty({ message: 'contractIds must not be empty' })
  @IsUUID('4', { each: true, message: 'contractId must be a valid UUID' })
  contractIds?: string[]
}
