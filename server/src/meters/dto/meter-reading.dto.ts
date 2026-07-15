import { Expose } from 'class-transformer'
import { UtilityType } from '../entities/utility-type.enum'

export class MeterReadingDto {
  @Expose()
  id: string

  @Expose()
  utilityType: UtilityType

  @Expose()
  value: number | null

  @Expose()
  isManual: boolean

  @Expose()
  readingDate: string

  @Expose()
  previousValue: number | null

  @Expose()
  consumption: number | null

  @Expose()
  tariffPrice: number | null

  @Expose()
  cost: number | null

  @Expose()
  unit: string

  @Expose()
  createdAt: Date
}
