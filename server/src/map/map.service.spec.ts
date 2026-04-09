import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Test, type TestingModule } from '@nestjs/testing'
import { MapService } from './map.service'
import { geocodeCacheKey, poiCacheKey } from './utils/map-cache-keys'
import { msUntilNextFirstOfMonth } from './utils/map-ttl'

// ─── helpers ────────────────────────────────────────────────────────────────

type RawElement = {
  id: number
  type: string
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags: Record<string, string>
}

function makeOverpassResponse(elements: object[]): string {
  return JSON.stringify({ elements })
}

function makeNode(id: number, lat: number, lon: number, tags: Record<string, string>): RawElement {
  return { id, type: 'node', lat, lon, tags }
}

function makeWay(id: number, centerLat: number, centerLon: number, tags: Record<string, string>): RawElement {
  return { id, type: 'way', center: { lat: centerLat, lon: centerLon }, tags }
}

const PHARMACY_NODE = makeNode(1, 50.62, 26.25, { amenity: 'pharmacy', name: 'Аптека №1' })
const BUS_NODE = makeNode(2, 50.621, 26.251, { highway: 'bus_stop', 'name:uk': 'Зупинка Центр' })
const CAFE_WAY = makeWay(3, 50.619, 26.249, { amenity: 'cafe', name: 'Кафе Затишок' })

const NOMINATIM_RESPONSE = JSON.stringify([
  { lat: '50.6196', lon: '26.2513', display_name: 'вул. Соборна, 10, Рівне, Україна' },
])

// ─── test suite ─────────────────────────────────────────────────────────────

describe('MapService', () => {
  let service: MapService
  let cache: { get: jest.Mock; set: jest.Mock }
  let fetchMock: jest.SpyInstance

  beforeEach(async () => {
    cache = { get: jest.fn(), set: jest.fn() }

    const module: TestingModule = await Test.createTestingModule({
      providers: [MapService, { provide: CACHE_MANAGER, useValue: cache }],
    }).compile()

    service = module.get(MapService)
    fetchMock = jest.spyOn(global, 'fetch')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  // ── TTL ──────────────────────────────────────────────────────────────────

  describe('msUntilNextFirstOfMonth', () => {
    it('returns a positive number', () => {
      expect(msUntilNextFirstOfMonth()).toBeGreaterThan(0)
    })

    it('never exceeds 32 days in ms', () => {
      expect(msUntilNextFirstOfMonth()).toBeLessThanOrEqual(32 * 24 * 60 * 60 * 1000)
    })

    it('matches the expected TTL within 1 second tolerance', () => {
      const now = new Date()
      const nextFirst = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0)
      const expected = nextFirst.getTime() - now.getTime()
      expect(Math.abs(msUntilNextFirstOfMonth() - expected)).toBeLessThan(1000)
    })
  })

  // ── cache key helpers ────────────────────────────────────────────────────

  describe('poiCacheKey', () => {
    it('rounds coordinates to 3 decimal places', () => {
      expect(poiCacheKey(50.61999, 26.25001)).toBe('map:poi:50.62:26.25')
      expect(poiCacheKey(50.62001, 26.25001)).toBe('map:poi:50.62:26.25')
    })

    it('produces different keys for coordinates outside rounding precision', () => {
      expect(poiCacheKey(50.62, 26.25)).not.toBe(poiCacheKey(50.621, 26.251))
    })
  })

  describe('geocodeCacheKey', () => {
    it('normalises street to lowercase and trims whitespace', () => {
      expect(geocodeCacheKey('  Соборна 10  ')).toBe('map:geocode:соборна 10')
      expect(geocodeCacheKey('соборна 10')).toBe('map:geocode:соборна 10')
      expect(geocodeCacheKey('СОБОРНА 10')).toBe('map:geocode:соборна 10')
    })
  })

  // ── getPoi ────────────────────────────────────────────────────────────────

  describe('getPoi', () => {
    const LAT = 50.62
    const LNG = 26.25

    it('returns cached data without calling Overpass', async () => {
      const cached = [{ id: 1, name: 'Аптека №1', category: 'pharmacy', lat: LAT, lng: LNG, tags: {} }]
      cache.get.mockResolvedValueOnce(cached)

      const result = await service.getPoi(LAT, LNG)

      expect(result).toEqual(cached)
      expect(fetchMock).not.toHaveBeenCalled()
      expect(cache.set).not.toHaveBeenCalled()
    })

    it('calls Overpass on cache miss, parses POIs and writes to cache', async () => {
      cache.get.mockResolvedValueOnce(null)
      fetchMock.mockResolvedValueOnce({
        ok: true,
        text: () => makeOverpassResponse([PHARMACY_NODE, BUS_NODE, CAFE_WAY]),
      } as unknown as Response)
      cache.set.mockResolvedValueOnce(undefined)

      const result = await service.getPoi(LAT, LNG)

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(result).toHaveLength(3)
      expect(result.find((p) => p.id === 1)).toMatchObject({
        category: 'pharmacy',
        name: 'Аптека №1',
        lat: 50.62,
        lng: 26.25,
      })
      expect(result.find((p) => p.id === 2)).toMatchObject({ category: 'bus_stop', name: 'Зупинка Центр' })
      expect(result.find((p) => p.id === 3)).toMatchObject({
        category: 'cafe',
        name: 'Кафе Затишок',
        lat: 50.619,
        lng: 26.249,
      })
    })

    it('stores result in cache with a positive TTL', async () => {
      cache.get.mockResolvedValueOnce(null)
      fetchMock.mockResolvedValueOnce({
        ok: true,
        text: () => makeOverpassResponse([PHARMACY_NODE]),
      } as unknown as Response)
      cache.set.mockResolvedValueOnce(undefined)

      await service.getPoi(LAT, LNG)

      expect(cache.set).toHaveBeenCalledTimes(1)
      const [_key, _value, ttl] = cache.set.mock.calls[0] as [string, unknown, number]
      expect(ttl).toBeGreaterThan(0)
      expect(ttl).toBeLessThanOrEqual(32 * 24 * 60 * 60 * 1000)
    })

    it('uses correct cache key with rounded coordinates', async () => {
      cache.get.mockResolvedValueOnce(null)
      fetchMock.mockResolvedValueOnce({
        ok: true,
        text: () => makeOverpassResponse([]),
      } as unknown as Response)
      cache.set.mockResolvedValueOnce(undefined)

      await service.getPoi(50.61999, 26.24999)

      expect(cache.get).toHaveBeenCalledWith('map:poi:50.62:26.25')
      const [key] = cache.set.mock.calls[0] as [string, unknown, number]
      expect(key).toBe('map:poi:50.62:26.25')
    })

    it('tries next Overpass mirror on 504 error', async () => {
      cache.get.mockResolvedValueOnce(null)
      fetchMock
        .mockResolvedValueOnce({ ok: false, status: 504, text: () => '504 Gateway Timeout' } as unknown as Response)
        .mockResolvedValueOnce({ ok: true, text: () => makeOverpassResponse([PHARMACY_NODE]) } as unknown as Response)
      cache.set.mockResolvedValueOnce(undefined)

      const result = await service.getPoi(LAT, LNG)

      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(result).toHaveLength(1)
    })

    it('skips elements without coordinates', async () => {
      cache.get.mockResolvedValueOnce(null)
      const noCoords = { id: 99, type: 'node', tags: { amenity: 'cafe' } }
      fetchMock.mockResolvedValueOnce({
        ok: true,
        text: () => makeOverpassResponse([noCoords, PHARMACY_NODE]),
      } as unknown as Response)
      cache.set.mockResolvedValueOnce(undefined)

      const result = await service.getPoi(LAT, LNG)

      expect(result.some((p) => p.id === 99)).toBe(false)
      expect(result.some((p) => p.id === 1)).toBe(true)
    })
  })

  // ── getBulkPoi ────────────────────────────────────────────────────────────

  describe('getBulkPoi', () => {
    it('returns empty array for empty input', async () => {
      const result = await service.getBulkPoi([])
      expect(result).toEqual([])
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('returns all cached data without calling Overpass when all points are cached', async () => {
      const cachedA = [{ id: 1, name: 'A', category: 'pharmacy', lat: 50.62, lng: 26.25, tags: {} }]
      const cachedB = [{ id: 2, name: 'B', category: 'cafe', lat: 50.63, lng: 26.26, tags: {} }]
      cache.get.mockResolvedValueOnce(cachedA).mockResolvedValueOnce(cachedB)

      const result = await service.getBulkPoi([
        { lat: 50.62, lng: 26.25 },
        { lat: 50.63, lng: 26.26 },
      ])

      expect(fetchMock).not.toHaveBeenCalled()
      expect(result).toHaveLength(2)
      expect(result.map((p) => p.id).sort()).toEqual([1, 2])
    })

    it('deduplicates POIs with the same id across points', async () => {
      const sharedPoi = { id: 10, name: 'Silpo', category: 'supermarket', lat: 50.621, lng: 26.251, tags: {} }
      cache.get.mockResolvedValueOnce([sharedPoi]).mockResolvedValueOnce([sharedPoi])

      const result = await service.getBulkPoi([
        { lat: 50.62, lng: 26.25 },
        { lat: 50.621, lng: 26.251 },
      ])

      expect(result.filter((p) => p.id === 10)).toHaveLength(1)
    })

    it('fetches from Overpass for uncached points and stores per-point cache', async () => {
      cache.get.mockResolvedValueOnce(null).mockResolvedValueOnce(null)
      fetchMock.mockResolvedValueOnce({
        ok: true,
        text: () =>
          makeOverpassResponse([
            makeNode(1, 50.621, 26.251, { amenity: 'pharmacy', name: 'Аптека' }),
            makeNode(2, 50.632, 26.262, { amenity: 'cafe', name: 'Кафе' }),
          ]),
      } as unknown as Response)
      cache.set.mockResolvedValue(undefined)

      await service.getBulkPoi([
        { lat: 50.621, lng: 26.251 },
        { lat: 50.632, lng: 26.262 },
      ])

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(cache.set).toHaveBeenCalledTimes(2)
    })

    it('mixes cached and uncached points correctly', async () => {
      const cachedPoi = { id: 5, name: 'Банк', category: 'bank', lat: 50.62, lng: 26.25, tags: {} }
      cache.get.mockResolvedValueOnce([cachedPoi]).mockResolvedValueOnce(null)
      fetchMock.mockResolvedValueOnce({
        ok: true,
        text: () => makeOverpassResponse([PHARMACY_NODE]),
      } as unknown as Response)
      cache.set.mockResolvedValueOnce(undefined)

      const result = await service.getBulkPoi([
        { lat: 50.62, lng: 26.25 },
        { lat: 50.63, lng: 26.26 },
      ])

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(result.map((p) => p.id).sort()).toEqual([1, 5])
    })
  })

  // ── geocode ───────────────────────────────────────────────────────────────

  describe('geocode', () => {
    it('returns cached geocode result without calling Nominatim', async () => {
      const cached = { lat: 50.619, lng: 26.251, displayName: 'вул. Соборна, Рівне' }
      cache.get.mockResolvedValueOnce(cached)

      const result = await service.geocode('Соборна 10')

      expect(result).toEqual(cached)
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('fetches from Nominatim on cache miss, writes to cache and returns result', async () => {
      cache.get.mockResolvedValueOnce(null)
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => JSON.parse(NOMINATIM_RESPONSE) as unknown,
      } as unknown as Response)
      cache.set.mockResolvedValueOnce(undefined)

      const result = await service.geocode('Соборна 10')

      expect(result).toEqual({ lat: 50.6196, lng: 26.2513, displayName: 'вул. Соборна, 10, Рівне, Україна' })
      expect(cache.set).toHaveBeenCalledTimes(1)
    })

    it('stores geocode result with a positive monthly TTL', async () => {
      cache.get.mockResolvedValueOnce(null)
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => JSON.parse(NOMINATIM_RESPONSE) as unknown,
      } as unknown as Response)
      cache.set.mockResolvedValueOnce(undefined)

      await service.geocode('Соборна 10')

      const [_key, _val, ttl] = cache.set.mock.calls[0] as [string, unknown, number]
      expect(ttl).toBeGreaterThan(0)
      expect(ttl).toBeLessThanOrEqual(32 * 24 * 60 * 60 * 1000)
    })

    it('uses lowercase-normalised cache key regardless of input casing', async () => {
      cache.get.mockResolvedValueOnce(null)
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => JSON.parse(NOMINATIM_RESPONSE) as unknown,
      } as unknown as Response)
      cache.set.mockResolvedValueOnce(undefined)

      await service.geocode('  СОБОРНА 10  ')

      expect(cache.get).toHaveBeenCalledWith('map:geocode:соборна 10')
      const [key] = cache.set.mock.calls[0] as [string, unknown, number]
      expect(key).toBe('map:geocode:соборна 10')
    })

    it('returns null when Nominatim responds with non-ok status', async () => {
      cache.get.mockResolvedValueOnce(null)
      fetchMock.mockResolvedValueOnce({ ok: false, status: 503 } as unknown as Response)

      const result = await service.geocode('невідома вулиця')

      expect(result).toBeNull()
      expect(cache.set).not.toHaveBeenCalled()
    })

    it('returns null when Nominatim returns empty array', async () => {
      cache.get.mockResolvedValueOnce(null)
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => [] as unknown,
      } as unknown as Response)

      const result = await service.geocode('невідома вулиця')

      expect(result).toBeNull()
      expect(cache.set).not.toHaveBeenCalled()
    })
  })

  // ── POI category / name mapping ───────────────────────────────────────────

  describe('POI category mapping', () => {
    const cases: Array<[Record<string, string>, string]> = [
      [{ amenity: 'pharmacy' }, 'pharmacy'],
      [{ amenity: 'bus_stop' }, 'bus_stop'],
      [{ highway: 'bus_stop' }, 'bus_stop'],
      [{ amenity: 'hospital' }, 'hospital'],
      [{ amenity: 'clinic' }, 'hospital'],
      [{ amenity: 'cafe' }, 'cafe'],
      [{ amenity: 'restaurant' }, 'restaurant'],
      [{ amenity: 'fast_food' }, 'restaurant'],
      [{ amenity: 'bank' }, 'bank'],
      [{ amenity: 'atm' }, 'atm'],
      [{ amenity: 'supermarket' }, 'supermarket'],
      [{ shop: 'supermarket' }, 'supermarket'],
      [{ shop: 'grocery' }, 'supermarket'],
      [{ shop: 'bakery' }, 'shop'],
      [{ amenity: 'parking' }, 'other'],
    ]

    test.each(cases)('tags %j → category "%s"', async (tags, expected) => {
      cache.get.mockResolvedValueOnce(null)
      fetchMock.mockResolvedValueOnce({
        ok: true,
        text: () => makeOverpassResponse([makeNode(1, 50.62, 26.25, tags)]),
      } as unknown as Response)
      cache.set.mockResolvedValueOnce(undefined)

      const pois = await service.getPoi(50.62, 26.25)

      expect(pois[0]?.category).toBe(expected)
    })
  })

  describe('POI name fallbacks', () => {
    it('prefers name:uk over name', async () => {
      cache.get.mockResolvedValueOnce(null)
      fetchMock.mockResolvedValueOnce({
        ok: true,
        text: () =>
          makeOverpassResponse([
            makeNode(1, 50.62, 26.25, { amenity: 'pharmacy', 'name:uk': 'Аптека', name: 'Apteka' }),
          ]),
      } as unknown as Response)
      cache.set.mockResolvedValueOnce(undefined)

      const pois = await service.getPoi(50.62, 26.25)

      expect(pois[0]?.name).toBe('Аптека')
    })

    it('falls back to category default when no name tags', async () => {
      cache.get.mockResolvedValueOnce(null)
      fetchMock.mockResolvedValueOnce({
        ok: true,
        text: () => makeOverpassResponse([makeNode(1, 50.62, 26.25, { amenity: 'pharmacy' })]),
      } as unknown as Response)
      cache.set.mockResolvedValueOnce(undefined)

      const pois = await service.getPoi(50.62, 26.25)

      expect(pois[0]?.name).toBe('Аптека')
    })
  })
})
