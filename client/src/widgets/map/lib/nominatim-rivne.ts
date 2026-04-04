import { NOMINATIM_API } from '../constants';
import type { NominatimResult, SearchResult } from '../types';

export async function geocodeStreetRivne(trimmedQuery: string): Promise<SearchResult | null> {
  const url = `${NOMINATIM_API}?q=${encodeURIComponent(`${trimmedQuery}, Рівне, Україна`)}&format=json&limit=1&countrycodes=ua`;
  const res = await fetch(url, {
    headers: { 'Accept-Language': 'uk,en', 'User-Agent': 'HousesCRM/1.0' },
  });
  if (!res.ok) return null;
  const results: NominatimResult[] = await res.json();
  if (!results.length) return null;
  return {
    lat: parseFloat(results[0].lat),
    lng: parseFloat(results[0].lon),
    displayName: results[0].display_name,
  };
}
