import { ContractStatus } from '../status';

export type RentersOccupancyItem = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  occupied: string;
  vacated: string;
  totalIncome: number;
  status: ContractStatus;
  contractsCount: number;
};
