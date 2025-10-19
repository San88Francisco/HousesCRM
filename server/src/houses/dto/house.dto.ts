import { Expose } from 'class-transformer'
import { ApartmentType } from '../entities/house.entity'

export class HouseDto {
  @Expose()
  id: string

  @Expose()
  apartmentName: string

  @Expose()
  roomsCount: number

  @Expose()
  totalArea: number

  @Expose()
  purchaseDate: Date

  @Expose()
  floor: number

  @Expose()
  street: string

  @Expose()
  apartmentType: ApartmentType
}
