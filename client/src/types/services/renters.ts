import { ContractStatus } from './statuses';

export type Renter = {
  id: string;
  firstName: string;
  lastName: string;
  occupied: string;
  vacated: string;
  totalIncome: number;
  status: ContractStatus;
};
