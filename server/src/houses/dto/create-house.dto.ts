import { IsDate, IsDefined, IsEnum, IsNumber, IsPositive, IsString, MaxLength, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApartmentType } from '../enums/apartment-type.enum'

export class CreateHouseDto {
  @IsDefined({ message: 'apartmentName is required' })
  @IsString({ message: 'apartmentName must be a string' })
  @MaxLength(30)
  public apartmentName: string

  @IsDefined({ message: 'roomsCount is required' })
  @IsNumber({}, { message: 'roomsCount must be a number' })
  @Min(1)
  public roomsCount: number

  @IsDefined({ message: 'totalArea is required' })
  @IsPositive({ message: 'totalArea must be positive' })
  @IsNumber({}, { message: 'totalArea must be a number' })
  public totalArea: number

  @IsDefined({ message: 'purchaseDate is required' })
  @IsDate({ message: 'purchaseDate is must be date' })
  @Type(() => Date)
  public purchaseDate: Date

  @IsDefined({ message: 'price is required' })
  @IsPositive({ message: 'price must be positive' })
  @IsNumber({}, { message: 'price must be a number' })
  public price: number

  @IsDefined({ message: 'floor is required' })
  @Min(1)
  @IsNumber({}, { message: 'floor must be a number' })
  public floor: number

  @IsDefined({ message: 'street is required' })
  @IsString({ message: 'street must be a string' })
  public street: string

  @IsDefined({ message: 'apartmentType is required' })
  @IsEnum(ApartmentType, { message: 'apartmentType must be a valid enum value' })
  public apartmentType: ApartmentType
}
