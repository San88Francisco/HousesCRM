import { Renter } from '@/types/core/renter';

export function isRenterEditModalPayload(payload: unknown): payload is { renter?: Renter } {
  return typeof payload === 'object' && payload !== null && 'renter' in payload;
}
