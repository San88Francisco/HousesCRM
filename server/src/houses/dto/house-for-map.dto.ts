import { Expose } from 'class-transformer'

export class HouseForMapDto {
  @Expose()
  id: string

  @Expose()
  apartmentName: string

  @Expose()
  street: string
}
