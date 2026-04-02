import { ContractStatus } from '@/types/core/status';

export type HouseOccupancyItem = {
  totalIncome: number;
  status: ContractStatus;
  id: string;
  firstName: string;
  lastName: string;
  occupied: string;
  vacated: string;
};
