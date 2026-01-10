import { Expose } from 'class-transformer'

export class GeocodeResponseDto {
  @Expose()
  lat: number

  @Expose()
  lng: number

  @Expose()
  displayName: string
}
