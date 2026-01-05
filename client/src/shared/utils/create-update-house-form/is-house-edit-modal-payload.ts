import { House } from '@/types/core/house/house';

export function isHouseEditModalPayload(payload: unknown): payload is { house?: House } {
  return typeof payload === 'object' && payload !== null && 'house' in payload;
}
