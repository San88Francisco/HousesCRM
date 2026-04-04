import type { GeocodedHouse } from '../types';

export function geocodedSuccessPoints(geocoded: GeocodedHouse[]) {
  return geocoded.filter(g => g.geocodeStatus === 'success').map(g => ({ lat: g.lat, lng: g.lng }));
}
