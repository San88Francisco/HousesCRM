import { Expose } from 'class-transformer'

export class RenterDto {
  @Expose()
  id: string

  @Expose()
  firstName: string

  @Expose()
  lastName: string

  @Expose()
  occupied: Date

  @Expose()
  vacated: Date
}
