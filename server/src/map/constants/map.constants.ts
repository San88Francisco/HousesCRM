export const OVERPASS_INSTANCES = [
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://z.overpass-api.de/api/interpreter',
] as const

export const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search'
export const RADIUS_METERS = 500
export const COORD_PRECISION = 3
export const BULK_POI_CHUNK = 2
export const BULK_POI_DELAY_MS = 800
export const OVERPASS_RETRY_BASE_MS = 700
export const POI_PROXIMITY_THRESHOLD = 0.006
