import { ContractStatus } from '@/types/core/status/status';

export type OccupancyHouses = {
  totalIncome: number;
  status: ContractStatus;
  id: string;
  firstName: string;
  lastName: string;
  occupied: string;
  vacated: string;
};
