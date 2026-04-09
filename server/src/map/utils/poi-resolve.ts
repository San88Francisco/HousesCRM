import type { OverpassElement } from '../dto/overpass.dto'
import type { POI } from '../dto/poi.dto'

const SUPERMARKET_SHOPS = new Set(['supermarket', 'grocery', 'convenience', 'hypermarket'])

const CATEGORY_FALLBACK_NAMES: Record<string, string> = {
  bus_stop: 'Зупинка',
  supermarket: 'Супермаркет',
  shop: 'Магазин',
  pharmacy: 'Аптека',
  hospital: 'Лікарня',
  cafe: 'Кафе',
  restaurant: 'Ресторан',
  bank: 'Банк',
  atm: 'Банкомат',
  other: 'Інше',
}

export function resolvePOICategory(tags: Record<string, string>): string {
  const amenity = tags.amenity ?? ''
  const shop = tags.shop ?? ''
  const highway = tags.highway ?? ''

  if (amenity === 'bus_stop' || highway === 'bus_stop') {
    return 'bus_stop'
  }
  if (amenity === 'pharmacy') {
    return 'pharmacy'
  }
  if (amenity === 'hospital' || amenity === 'clinic' || amenity === 'doctors') {
    return 'hospital'
  }
  if (amenity === 'cafe') {
    return 'cafe'
  }
  if (amenity === 'restaurant' || amenity === 'fast_food' || amenity === 'food_court') {
    return 'restaurant'
  }
  if (amenity === 'bank') {
    return 'bank'
  }
  if (amenity === 'atm') {
    return 'atm'
  }
  if (amenity === 'supermarket' || SUPERMARKET_SHOPS.has(shop)) {
    return 'supermarket'
  }
  if (shop) {
    return 'shop'
  }
  return 'other'
}

export function resolveName(tags: Record<string, string>, category: string): string {
  return tags['name:uk'] ?? tags.name ?? tags['name:ru'] ?? tags['brand'] ?? CATEGORY_FALLBACK_NAMES[category] ?? 'Інше'
}

export function elementsToPois(elements: OverpassElement[]): POI[] {
  const list: POI[] = []
  for (const el of elements) {
    const hasCoords =
      (el.lat !== undefined && el.lon !== undefined) || (el.center?.lat !== undefined && el.center?.lon !== undefined)
    if (!hasCoords || !el.tags) {
      continue
    }

    const elLat = el.lat ?? el.center?.lat
    const elLng = el.lon ?? el.center?.lon
    if (elLat === undefined || elLng === undefined) {
      continue
    }

    const category = resolvePOICategory(el.tags)
    const name = resolveName(el.tags, category)
    list.push({ id: el.id, name, category, lat: elLat, lng: elLng, tags: el.tags })
  }
  return list
}
