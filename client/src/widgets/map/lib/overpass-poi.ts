import type { OverpassElement, OverpassResponse, POI, POICategory } from '../types';

const INSTANCES = [
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://z.overpass-api.de/api/interpreter',
] as const;

const RADIUS_METERS = 500;

export const OVERPASS_MERGE_CHUNK = 2;
export const OVERPASS_BETWEEN_CHUNK_MS = 800;
const BETWEEN_MIRROR_MS = 700;

function sleep(ms: number) {
  return new Promise<void>(r => setTimeout(r, ms));
}

function poiCategoryFromAmenity(amenity: string, highway: string): POICategory | null {
  if (amenity === 'bus_stop' || highway === 'bus_stop') return 'bus_stop';
  if (amenity === 'pharmacy') return 'pharmacy';
  if (amenity === 'hospital' || amenity === 'clinic' || amenity === 'doctors') return 'hospital';
  if (amenity === 'cafe') return 'cafe';
  if (amenity === 'restaurant' || amenity === 'fast_food' || amenity === 'food_court') {
    return 'restaurant';
  }
  if (amenity === 'bank') return 'bank';
  if (amenity === 'atm') return 'atm';
  if (amenity === 'supermarket') return 'supermarket';
  return null;
}

function poiCategoryFromShop(shop: string, amenity: string): POICategory | null {
  if (
    shop === 'supermarket' ||
    shop === 'grocery' ||
    shop === 'convenience' ||
    shop === 'hypermarket' ||
    amenity === 'supermarket'
  ) {
    return 'supermarket';
  }
  if (shop) return 'shop';
  return null;
}

function resolvePOICategory(tags: Record<string, string>): POICategory {
  const amenity = tags.amenity ?? '';
  const shop = tags.shop ?? '';
  const highway = tags.highway ?? '';
  return poiCategoryFromAmenity(amenity, highway) ?? poiCategoryFromShop(shop, amenity) ?? 'other';
}

function resolveName(tags: Record<string, string>, category: POICategory): string {
  return (
    tags['name:uk'] ??
    tags.name ??
    tags['name:ru'] ??
    tags['brand'] ??
    {
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
    }[category]
  );
}

function aroundBlock(lat: number, lng: number): string {
  const a = `(around:${RADIUS_METERS},${lat},${lng})`;
  return `
  nwr${a}[shop];
  nwr${a}[amenity~"^(bus_stop|pharmacy|hospital|clinic|doctors|cafe|restaurant|fast_food|food_court|bank|atm|supermarket|fuel|post_office|police|kindergarten|school)$"];
  node${a}[highway="bus_stop"];
  node${a}[public_transport="stop_position"];
  node${a}[public_transport="platform"];`;
}

export function buildInfrastructureQuery(lat: number, lng: number): string {
  return `
[out:json][timeout:40];
(
${aroundBlock(lat, lng)}
);
out center tags;
  `.trim();
}

export function buildInfrastructureChunkQuery(points: { lat: number; lng: number }[]): string {
  const inner = points.map(p => aroundBlock(p.lat, p.lng)).join('\n');
  return `
[out:json][timeout:75];
(
${inner}
);
out center tags;
  `.trim();
}

export function overpassElementsToPois(elements: OverpassElement[]): POI[] {
  const list: POI[] = [];
  for (const el of elements) {
    const hasCoords =
      (el.lat !== undefined && el.lon !== undefined) ||
      (el.center?.lat !== undefined && el.center?.lon !== undefined);
    if (!hasCoords || !el.tags) continue;

    const tags = el.tags;
    const elLat = el.lat ?? el.center?.lat;
    const elLng = el.lon ?? el.center?.lon;
    if (elLat === undefined || elLng === undefined) continue;
    const category = resolvePOICategory(tags);
    const name = resolveName(tags, category);

    list.push({
      id: el.id,
      name,
      category,
      lat: elLat,
      lng: elLng,
      tags,
    });
  }
  return list;
}

function busyHtml(text: string): boolean {
  const t = text.trimStart();
  if (!t.startsWith('<')) return false;
  return /too busy|timeout|runtime error|Dispatcher_Client|504/i.test(t);
}

async function postOnce(url: string, query: string): Promise<OverpassElement[]> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`,
  });

  const text = await response.text();
  const trimmed = text.trimStart();

  if (trimmed.startsWith('<')) {
    if (busyHtml(text) || response.status === 504 || response.status === 502) {
      throw new Error('OVERPASS_BUSY');
    }
    throw new Error(`Overpass помилка: ${response.status}`);
  }

  if (!response.ok) {
    if (response.status === 504 || response.status === 502 || response.status === 429) {
      throw new Error('OVERPASS_BUSY');
    }
    throw new Error(`Overpass помилка: ${response.status}`);
  }

  let data: OverpassResponse;
  try {
    data = JSON.parse(text) as OverpassResponse;
  } catch {
    throw new Error('OVERPASS_BUSY');
  }

  return data.elements ?? [];
}

export async function runOverpassQuery(query: string): Promise<OverpassElement[]> {
  let lastError = new Error('Overpass: немає відповіді');

  for (let i = 0; i < INSTANCES.length; i++) {
    const url = INSTANCES[i];
    try {
      return await postOnce(url, query);
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      if (i < INSTANCES.length - 1) {
        await sleep(BETWEEN_MIRROR_MS * (i + 1));
      }
    }
  }

  if (lastError.message === 'OVERPASS_BUSY') {
    throw new Error(
      'Сервер OpenStreetMap (Overpass) зайнятий або перевантажений. Спробуйте «Оновити дані» через хвилину.',
    );
  }
  throw lastError;
}
