import { RenterModalPayload } from '@/types/model/renter';

export function isRenterModalPayload(payload: unknown): payload is RenterModalPayload {
  return typeof payload === 'object' && payload !== null && 'renter' in payload;
}
