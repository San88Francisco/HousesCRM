import { Expose } from 'class-transformer'
import { ApartmentType } from '../enums/apartment-type.enum'

export class HouseDto {
  @Expose()
  public id: string

  @Expose()
  public apartmentName: string

  @Expose()
  public roomsCount: number

  @Expose()
  public totalArea: number

  @Expose()
  public purchaseDate: Date

  @Expose()
  public floor: number

  @Expose()
  public street: string

  @Expose()
  public apartmentType: ApartmentType
}
