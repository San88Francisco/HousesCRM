import { Expose } from 'class-transformer'

export class RenterDto {
  @Expose()
  public id: string

  @Expose()
  public firstName: string

  @Expose()
  public lastName: string

  @Expose()
  public occupied: Date

  @Expose()
  public vacated?: Date | null
}
