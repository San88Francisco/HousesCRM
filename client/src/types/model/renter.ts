import { ContractStatus } from '../core/status/status';

export type RenterCreateDTO = { firstName: string; lastName: string; age: number };

export type RenterResponse = RenterCreateDTO & {
  id: string;
  occupied: string;
  vacated?: string;
  status: ContractStatus;
  totalIncome?: number;
};

export type RenterModalPayload = {
  renter: RenterResponse;
};

export type CreateRenterPayload = RenterCreateDTO;
export type RenterUpdateDTO = RenterCreateDTO;
