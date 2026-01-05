import { ContractStatus } from '../status/status';

export interface Renter {
  id: string;
  age: number;
  firstName: string;
  lastName: string;
  occupied: string;
  vacated?: string;
  totalIncome: number;
  status: ContractStatus;
}

export type RenterFormFields = Pick<Renter, 'firstName' | 'lastName' | 'age'>;
