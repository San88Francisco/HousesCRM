import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, Logger } from '@nestjs/common'
import type { Cache } from 'cache-manager'
import {
  BULK_POI_CHUNK,
  BULK_POI_DELAY_MS,
  NOMINATIM_API,
  OVERPASS_INSTANCES,
  OVERPASS_RETRY_BASE_MS,
  POI_PROXIMITY_THRESHOLD,
} from './constants/map.constants'
import type { NominatimResult, OverpassElement } from './dto/overpass.dto'
import type { GeocodeResult, POI } from './dto/poi.dto'
import { buildGeocodeQuery } from './utils/geocode-query'
import { geocodeCacheKey, poiCacheKey } from './utils/map-cache-keys'
import { msUntilNextFirstOfMonth } from './utils/map-ttl'
import { buildBulkQuery, buildQuery } from './utils/overpass-query'
import { elementsToPois } from './utils/poi-resolve'

@Injectable()
export class MapService {
  private readonly logger = new Logger(MapService.name)

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  private async runOverpassQuery(query: string): Promise<OverpassElement[]> {
    let lastError = new Error('Overpass: немає відповіді')

    for (let i = 0; i < OVERPASS_INSTANCES.length; i++) {
      const url = OVERPASS_INSTANCES[i]
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `data=${encodeURIComponent(query)}`,
        })

        const text = await response.text()
        if (text.trimStart().startsWith('<')) {
          throw new Error('OVERPASS_BUSY')
        }
        if (!response.ok) {
          if (response.status === 504 || response.status === 502 || response.status === 429) {
            throw new Error('OVERPASS_BUSY')
          }
          throw new Error(`Overpass помилка: ${response.status}`)
        }

        const data = JSON.parse(text) as { elements: OverpassElement[] }
        return data.elements ?? []
      } catch (e) {
        lastError = e instanceof Error ? e : new Error(String(e))
        if (i < OVERPASS_INSTANCES.length - 1) {
          await new Promise<void>((r) => {
            setTimeout(r, OVERPASS_RETRY_BASE_MS * (i + 1))
          })
        }
      }
    }

    throw lastError
  }

  async getPoi(lat: number, lng: number): Promise<POI[]> {
    const cacheKey = poiCacheKey(lat, lng)
    const cached = await this.cacheManager.get<POI[]>(cacheKey)
    if (cached) {
      this.logger.debug(`POI cache hit: ${cacheKey}`)
      return cached
    }

    this.logger.log(`POI cache miss: ${cacheKey} — fetching from Overpass`)
    const pois = elementsToPois(await this.runOverpassQuery(buildQuery(lat, lng)))

    const ttl = msUntilNextFirstOfMonth()
    await this.cacheManager.set(cacheKey, pois, ttl)
    this.logger.log(`POI cached: ${cacheKey} (TTL ${Math.round(ttl / 3600000)}h)`)

    return pois
  }

  async getBulkPoi(points: { lat: number; lng: number }[]): Promise<POI[]> {
    if (!points.length) {
      return []
    }

    const uncached: { lat: number; lng: number }[] = []
    const byId = new Map<number, POI>()

    for (const point of points) {
      const cacheKey = poiCacheKey(point.lat, point.lng)
      const cached = await this.cacheManager.get<POI[]>(cacheKey)
      if (cached) {
        this.logger.debug(`Bulk POI cache hit: ${cacheKey}`)
        for (const poi of cached) {
          byId.set(poi.id, poi)
        }
      } else {
        uncached.push(point)
      }
    }

    if (uncached.length > 0) {
      this.logger.log(`Bulk POI cache miss for ${uncached.length} points — fetching from Overpass`)
      const ttl = msUntilNextFirstOfMonth()

      for (let i = 0; i < uncached.length; i += BULK_POI_CHUNK) {
        if (i > 0) {
          await new Promise<void>((r) => {
            setTimeout(r, BULK_POI_DELAY_MS)
          })
        }
        const chunk = uncached.slice(i, i + BULK_POI_CHUNK)
        const pois = elementsToPois(await this.runOverpassQuery(buildBulkQuery(chunk)))
        for (const poi of pois) {
          byId.set(poi.id, poi)
        }

        for (const point of chunk) {
          const cacheKey = poiCacheKey(point.lat, point.lng)
          const pointPois = pois.filter(
            (poi) =>
              Math.abs(poi.lat - point.lat) < POI_PROXIMITY_THRESHOLD &&
              Math.abs(poi.lng - point.lng) < POI_PROXIMITY_THRESHOLD
          )
          await this.cacheManager.set(cacheKey, pointPois, ttl)
        }
      }
    }

    return [...byId.values()]
  }

  async geocode(street: string): Promise<GeocodeResult | null> {
    const cacheKey = geocodeCacheKey(street)
    const cached = await this.cacheManager.get<GeocodeResult>(cacheKey)
    if (cached) {
      this.logger.debug(`Geocode cache hit: ${cacheKey}`)
      return cached
    }

    this.logger.log(`Geocode cache miss: ${cacheKey} — fetching from Nominatim`)

    const url = `${NOMINATIM_API}?q=${encodeURIComponent(buildGeocodeQuery(street))}&format=json&limit=1&countrycodes=ua`
    const response = await fetch(url, {
      headers: { 'Accept-Language': 'uk,en', 'User-Agent': 'HousesCRM/1.0' },
    })

    if (!response.ok) {
      return null
    }

    const results = (await response.json()) as NominatimResult[]
    if (!results.length) {
      return null
    }

    const result: GeocodeResult = {
      lat: parseFloat(results[0].lat),
      lng: parseFloat(results[0].lon),
      displayName: results[0].display_name,
    }

    const ttl = msUntilNextFirstOfMonth()
    await this.cacheManager.set(cacheKey, result, ttl)
    this.logger.log(`Geocode cached: ${cacheKey} (TTL ${Math.round(ttl / 3600000)}h)`)

    return result
  }
}
