import { ContractStatus } from '../status';

export interface Renter {
  id: string;
  age: number;
  firstName: string;
  lastName: string;
  occupied: string;
  vacated: string;
  totalIncome: number;
  status: ContractStatus;
  contractIds?: string[];
}
