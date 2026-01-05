import { HouseModalPayload } from '@/types/model/house-create-update-modal/house-create-update-modal';

export function isHouseEditModalPayload(payload: unknown): payload is HouseModalPayload {
  return typeof payload === 'object' && payload !== null && 'house' in payload;
}
