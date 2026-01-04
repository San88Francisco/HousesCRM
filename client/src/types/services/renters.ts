import { HousesPerformanceResponse } from '../core/houses-performance/types';
import { ContractStatus } from '../core/status/status';

export type Renter = {
  id: string;
  age: number;
  firstName: string;
  lastName: string;
  occupied: string;
  vacated: string;
  totalIncome: number;
  status: ContractStatus;
};

export type RenterByIdResponse = {
  oneRenterReport: Renter;
  allContractsByRenterId: HousesPerformanceResponse;
};
