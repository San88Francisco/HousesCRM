import { IsArray, IsNumber, Max, Min, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class PointDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number

  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number
}

export class BulkPoiQueryDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PointDto)
  points: PointDto[]
}
