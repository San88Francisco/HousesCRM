import { ContractStatus } from '@/types/core/status';

export type HouseOccupancyItem = {
  totalIncome: number;
  status: ContractStatus;
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  occupied: string;
  vacated: string;
  contractId?: string;
};
