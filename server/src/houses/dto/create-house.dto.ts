import { Type } from 'class-transformer'
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator'
import { ApartmentType } from '../entities/house.entity'

export class CreateHouseDto {
  @IsDefined({ message: 'apartmentName is required' })
  @IsString({ message: 'apartmentName must be a string' })
  @IsNotEmpty({ message: 'apartmentName must not be empty' })
  @MaxLength(45, { message: 'apartmentName must be shorter than or equal to 45 characters' })
  apartmentName: string

  @IsDefined({ message: 'roomsCount is required' })
  @IsNumber({}, { message: 'roomsCount must be a number' })
  @Min(1)
  roomsCount: number

  @IsDefined({ message: 'totalArea is required' })
  @IsPositive({ message: 'totalArea must be positive' })
  @IsNumber({}, { message: 'totalArea must be a number' })
  totalArea: number

  @IsDefined({ message: 'purchaseDate is required' })
  @IsDate({ message: 'purchaseDate is must be date' })
  @Type(() => Date)
  purchaseDate: Date

  @IsDefined({ message: 'price is required' })
  @IsPositive({ message: 'price must be positive' })
  @IsNumber({}, { message: 'price must be a number' })
  price: number

  @IsDefined({ message: 'floor is required' })
  @Min(1)
  @IsNumber({}, { message: 'floor must be a number' })
  floor: number

  @IsDefined({ message: 'street is required' })
  @IsString({ message: 'street must be a string' })
  @IsNotEmpty({ message: 'street must not be empty' })
  @MaxLength(45, { message: 'street must be shorter than or equal to 45 characters' })
  street: string

  @IsDefined({ message: 'apartmentType is required' })
  @IsEnum(ApartmentType, { message: 'apartmentType must be a valid enum value' })
  apartmentType: ApartmentType

  @IsOptional()
  @IsArray({ message: 'contractIds must be an array' })
  @ArrayNotEmpty({ message: 'contractIds must not be empty' })
  @IsUUID('4', { each: true, message: 'contractId must be a valid UUID' })
  contractIds?: string[]
}
