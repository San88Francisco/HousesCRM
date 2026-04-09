import type { POI } from '../types';

export function isGenericOtherPoiName(poi: POI): boolean {
  if (poi.category !== 'other') return false;
  const name = poi.name.trim().toLowerCase();
  return !name || name === 'other' || name === 'інше';
}
