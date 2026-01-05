import { Renter } from '@/types/core/renter/renter';

export function isRenterModalPayload(payload: unknown): payload is { renter?: Renter } {
  return typeof payload === 'object' && payload !== null && 'renter' in payload;
}
