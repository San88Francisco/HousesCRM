import { ArrayNotEmpty, IsArray, IsDefined, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator'

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
  @IsString({ message: 'Age must be a string' })
  @MinLength(0)
  @MaxLength(100)
  age: string

  @IsOptional()
  @IsArray({ message: 'contractIds must be an array' })
  @ArrayNotEmpty({ message: 'contractIds must not be empty' })
  @IsUUID('4', { each: true, message: 'contractId must be a valid UUID' })
  contractIds?: string[]
}
