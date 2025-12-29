import { HouseModalPayload } from '@/types/model/house';

export function isHouseModalPayload(payload: unknown): payload is HouseModalPayload {
  return typeof payload === 'object' && payload !== null && 'house' in payload;
}
