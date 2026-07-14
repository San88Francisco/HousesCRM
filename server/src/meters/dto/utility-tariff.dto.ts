import { Expose } from 'class-transformer'
import { UtilityType } from '../entities/utility-type.enum'

export class UtilityTariffDto {
  @Expose()
  id: string

  @Expose()
  utilityType: UtilityType

  @Expose()
  pricePerUnit: number

  @Expose()
  validFrom: string

  @Expose()
  createdAt: Date
}
