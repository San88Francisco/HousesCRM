import { Expose, Type } from 'class-transformer'
import { MeterReadingDto } from './meter-reading.dto'

export class MeterReadingsResponseDto {
  @Expose()
  @Type(() => MeterReadingDto)
  data: MeterReadingDto[]
}
