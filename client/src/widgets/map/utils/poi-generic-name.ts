import { POI_VISUAL } from '../constants';
import type { POI } from '../types';

export function isGenericOtherPoiName(poi: POI): boolean {
  if (poi.category !== 'other') return false;
  const n = poi.name.trim();
  if (!n) return true;
  const lower = n.toLowerCase();
  return n === POI_VISUAL.other.label || lower === 'other' || lower === 'інше' || n === 'Інше';
}
