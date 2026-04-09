import { COORD_PRECISION } from '../constants/map.constants'

function roundCoord(n: number): number {
  return parseFloat(n.toFixed(COORD_PRECISION))
}

export function poiCacheKey(lat: number, lng: number): string {
  return `map:poi:${roundCoord(lat)}:${roundCoord(lng)}`
}

export function geocodeCacheKey(street: string): string {
  return `map:geocode:${street.toLowerCase().trim()}`
}
