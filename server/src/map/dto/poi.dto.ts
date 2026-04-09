export interface POI {
  id: number
  name: string
  category: string
  lat: number
  lng: number
  tags: Record<string, string>
}

export interface GeocodeResult {
  lat: number
  lng: number
  displayName: string
}
