import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class GeocodeRequestDto {
  @ApiProperty({ description: 'Address to geocode', example: 'вул. Данила Галицького, 4' })
  @IsString()
  @IsNotEmpty()
  address: string

  @ApiProperty({ description: 'City name for geocoding', example: 'Рівне' })
  @IsString()
  @IsNotEmpty()
  city: string
}

